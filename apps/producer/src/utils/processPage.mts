
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

        const blocksWithChildren = results.filter((block) => block.has_children);

        // console.log(JSON.stringify(blocksWithChildren, null, 2));

        await queue.addBulk(blocksWithChildren.map((block) => ({
            name: 'processNestedBlock',
            data: {
                page_id: page.id,
                block,
            },
        })));

        await db.insertInto('pages').values({
            database_id: database.id,
            database_alias: database.alias,
            page_id: page.id,
            body: results,
            created_by: page.created_by.id,
            updated_by: page.last_edited_by.id,
            created_at: page.created_time,
            updated_at: page.last_edited_time,
        }).onConflict(oc => oc.column('page_id').doUpdateSet({
            body: (eb) => eb.ref('excluded.body'),
            updated_by: (eb) => eb.ref('excluded.updated_by'),
            updated_at: (eb) => eb.ref('excluded.updated_at'),
        })).execute();
    } catch (error) {
        console.error({
            location: 'processPage',
            error,
        });
    }
}