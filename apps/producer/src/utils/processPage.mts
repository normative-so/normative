
import { BlockObjectResponse, PageObjectResponse, PartialBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import notion from "../connections/notion.mjs";
import { db } from "../db/postgres.mjs";
import { NotionDatabase } from "../types.mjs";
import queue from "../connections/bull.mjs";
import { getNestedBlocks } from "./getNestedBlocks.mjs";


export const processPage = async ({ page, database }: { page: PageObjectResponse, database: NotionDatabase }) => {
    try {
        const { results }: {
            results: BlockObjectResponse[];
        } = await notion.blocks.children.list({
            block_id: page.id,
        }) as { results: BlockObjectResponse[] };

        const blocksWithChildren = await Promise.all(results.map(async (block) => {
            if (block.has_children) {
                const children = await getNestedBlocks(block.id);
                return {
                    ...block,
                    children,
                }
            }

            return block;
        }))

        await db.insertInto('pages').values({
            database_id: database.id,
            database_alias: database.alias,
            page_id: page.id,
            body: blocksWithChildren,
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