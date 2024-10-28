import { writeFileSync } from "fs";
import queue from "../connections/bull.mjs";
import notion from "../connections/notion.mjs";
import { db } from "../db/postgres.mjs";
import redis from "../connections/redis.mjs";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";


export const processDatabase = async (database_id: string) => {
    const last_checked = await redis.get(`last_checked_${database_id}`) ?? new Date(0).toISOString();

    const { results: pages } = await notion.databases.query({
        database_id: database_id,
        // filter: {
        //     timestamp: "last_edited_time",
        //     last_edited_time: {
        //         on_or_after: last_checked,
        //     }
        // }
    });

    const result = (pages as PageObjectResponse[]).flatMap(item =>
        Object.entries(item.properties).map(([key, value]) => {
            return {
                page_id: item.id,
                field_id: value.id,
                type: value.type,
                value: Array.isArray((value as any)[value.type]) ? (value as any)[value.type] : [(value as any)[value.type]],
            };
        })
    );

    await db.transaction().execute(async (trx) => {
        trx
            .deleteFrom('properties')
            .where('page_id', 'in', pages.map((page) => page.id))
            .execute();

        trx
            .insertInto('properties')
            .values(result)
            .execute();

        trx
            .insertInto('pages')
            .values((pages as PageObjectResponse[]).map((page) => {
                return {
                    database_id: database_id,
                    page_id: page.id,
                    created_by: page.created_by.id,
                    updated_by: page.last_edited_by.id,
                    created_at: page.created_time,
                    updated_at: page.last_edited_time,
                };
            }))
            .onConflict(oc => oc.column('page_id').doUpdateSet({
                updated_by: (eb) => eb.ref('excluded.updated_by'),
                updated_at: (eb) => eb.ref('excluded.updated_at'),
            }))
            .execute();
    })

    await redis.set(`last_checked_${database_id}`, new Date().toISOString());

    await queue.addBulk(pages.map((page) => ({
        name: 'processPage',
        data: {
            page: page,
        },
    })));
}