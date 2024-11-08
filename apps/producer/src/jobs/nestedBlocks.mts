import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Job } from "bullmq";
import notion from "../connections/notion.mjs";
import { db } from "../db/postgres.mjs";
import nestedBlockQueue from "../queues/nestedBlockQueue.mjs";
import { NotionBlock } from "../types.mjs";

export const processNestedBlocks = async (job: Job<NotionBlock>) => {
    try {
        console.log('Processing nested blocks:', job.data.block_id);

        const { results } = await notion.blocks.children.list({
            block_id: job.data.block_id,
        }) as { results: BlockObjectResponse[] };

        const children = results.filter(child => child.has_children).map((child) => child.id);

        await nestedBlockQueue.addBulk(children.map((child_id) => ({
            name: 'processNestedBlock',
            data: {
                page_id: job.data.page_id,
                block_id: child_id,
            },
        })));


        await db.insertInto('blocks').values(results.map((child) => ({
            block_id: child.id,
            page_id: job.data.page_id,
            parent_id: job.data.block_id,
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