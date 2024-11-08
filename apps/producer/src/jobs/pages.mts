
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Job } from "bullmq";
import notion from "../connections/notion.mjs";
import { db } from "../db/postgres.mjs";
import nestedBlockQueue from "../queues/nestedBlockQueue.mjs";
import { NotionPage } from "../types.mjs";


export const processPage = async (job: Job<NotionPage>) => {
    try {
        console.log('Processing page:', job.data.page.id);

        const { results }: {
            results: BlockObjectResponse[];
        } = await notion.blocks.children.list({
            block_id: job.data.page.id,
        }) as { results: BlockObjectResponse[] };

        const nestedBlockIds = results.filter(block => block.has_children).map((block) => block.id);

        await nestedBlockQueue.addBulk(nestedBlockIds.map((block_id) => ({
            name: 'processNestedBlock',
            data: { page_id: job.data.page.id, block_id: block_id },
        })));

        await db.transaction().execute(async (trx) => {
            trx.insertInto('pages').values({
                database_id: job.data.database.id,
                database_alias: job.data.database.alias,
                page_id: job.data.page.id,
                created_by: job.data.page.created_by.id,
                updated_by: job.data.page.last_edited_by.id,
                created_at: job.data.page.created_time,
                updated_at: job.data.page.last_edited_time,
            }).onConflict(oc => oc.column('page_id').doUpdateSet({
                updated_by: (eb) => eb.ref('excluded.updated_by'),
                updated_at: (eb) => eb.ref('excluded.updated_at'),
            })).execute();

            trx.insertInto('blocks').values(results.map((block) => ({
                block_id: block.id,
                page_id: job.data.page.id,
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

        await job.updateProgress(100);
    } catch (error) {
        console.error({
            location: 'processPage',
            error,
        });
    }
}