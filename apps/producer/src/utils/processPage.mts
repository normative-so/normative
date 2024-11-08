
import { BlockObjectResponse, PageObjectResponse, PartialBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import notion from "../connections/notion.mjs";
import { db } from "../db/postgres.mjs";
import { NotionDatabase } from "../types.mjs";
import queue from "../connections/bull.mjs";


export const processPage = async ({ page, database }: { page: PageObjectResponse, database: NotionDatabase }) => {
    try {
        const { results }: {
            results: BlockObjectResponse[];
        } = await notion.blocks.children.list({
            block_id: page.id,
        }) as { results: BlockObjectResponse[] };

        const nestedBlockIds = results.filter(block => block.has_children).map((block) => block.id);

        await queue.addBulk(nestedBlockIds.map((block_id) => ({
            name: 'processNestedBlock',
            data: { page_id: page.id, block_id: block_id },
        })));

        await db.transaction().execute(async (trx) => {
            trx.insertInto('pages').values({
                database_id: database.id,
                database_alias: database.alias,
                page_id: page.id,
                created_by: page.created_by.id,
                updated_by: page.last_edited_by.id,
                created_at: page.created_time,
                updated_at: page.last_edited_time,
            }).onConflict(oc => oc.column('page_id').doUpdateSet({
                updated_by: (eb) => eb.ref('excluded.updated_by'),
                updated_at: (eb) => eb.ref('excluded.updated_at'),
            })).execute();

            trx.insertInto('blocks').values(results.map((block) => ({
                block_id: block.id,
                page_id: page.id,
                parent_id: null,
                type: block.type,
                created_by: block.created_by.id,
                content: block[block.type as keyof BlockObjectResponse],
                updated_by: block.last_edited_by.id,
                created_at: block.created_time,
                updated_at: block.last_edited_time,
            }))).onConflict(oc => oc.column('block_id').doUpdateSet({
                updated_by: (eb) => eb.ref('excluded.updated_by'),
                updated_at: (eb) => eb.ref('excluded.updated_at'),
                content: (eb) => eb.ref('excluded.content'),
            })).execute();
        });
    } catch (error) {
        console.error({
            location: 'processPage',
            error,
        });
    }
}