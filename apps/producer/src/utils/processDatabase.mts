import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import queue from "../connections/bull.mjs";
import notion from "../connections/notion.mjs";
import redis from "../connections/redis.mjs";
import { db } from "../db/postgres.mjs";


export const processDatabase = async (database_id: string) => {
    try {
        const last_checked = await redis.get(`last_checked_${database_id}`) ?? new Date(0).toISOString();

        const { results: pages } = await notion.databases.query({
            database_id: database_id,
            filter: {
                timestamp: "last_edited_time",
                last_edited_time: {
                    on_or_after: last_checked,
                }
            }
        });

        const result = (pages as PageObjectResponse[]).flatMap(item =>
            Object.entries(item.properties).map(([key, value]) => {
                return {
                    page_id: item.id,
                    field_id: value.id,
                    field_name: key,
                    type: value.type,
                    value: Array.isArray((value as any)[value.type]) ? (value as any)[value.type] : [(value as any)[value.type]],
                };
            })
        );

        if (result.length > 0) {
            await db.transaction().execute(async (trx) => {
                trx
                    .deleteFrom('properties')
                    .where('page_id', 'in', pages.map((page) => page.id))
                    .execute();

                trx
                    .insertInto('properties')
                    .values(result)
                    .execute();
            })
        }

        await redis.set(`last_checked_${database_id}`, new Date().toISOString());

        await queue.addBulk(pages.map((page) => ({
            name: 'processPage',
            data: {
                page: page,
            },
        })));
    } catch (error) {
        console.error(error);
    }
}