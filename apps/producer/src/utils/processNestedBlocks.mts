import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import notion from "../connections/notion.mjs";
import queue from "../connections/bull.mjs";
import { db } from "../db/postgres.mjs";

export const processNestedBlocks = async ({ page_id, block_id }: { page_id: string, block_id: string }) => {
    console.log({ page_id, block_id });

    try {
        const { results } = await notion.blocks.children.list({
            block_id,
        }) as { results: BlockObjectResponse[] };

        const children = results.filter(child => child.has_children).map((child) => child.id);

        await queue.addBulk(children.map((child_id) => ({
            name: 'processNestedBlock',
            data: {
                page_id,
                block_id: child_id,
            },
        })));


        await db.insertInto('blocks').values(results.map((child) => ({
            block_id: child.id,
            page_id: page_id,
            parent_id: block_id,
            type: child.type,
            created_by: child.created_by.id,
            content: child[child.type as keyof BlockObjectResponse],
            updated_by: child.last_edited_by.id,
            created_at: child.created_time,
            updated_at: child.last_edited_time,
        }))).onConflict(oc => oc.column('block_id').doUpdateSet({
            updated_by: (eb) => eb.ref('excluded.updated_by'),
            updated_at: (eb) => eb.ref('excluded.updated_at'),
            content: (eb) => eb.ref('excluded.content'),
        })).execute();
    } catch (error) {
        console.error({
            location: 'processNestedBlocks',
            error,
        });
    }
}