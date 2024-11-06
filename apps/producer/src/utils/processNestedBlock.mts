
import { BlockObjectResponse, PageObjectResponse, PartialBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import notion from "../connections/notion.mjs";

export const processNestedBlock = async ({ page_id, block }: { page_id: string, block: BlockObjectResponse }) => {
    try {
        // console.log({ page_id, block });

        const { results }: {
            results: BlockObjectResponse[];
        } = await notion.blocks.children.list({
            block_id: block.id,
        }) as { results: BlockObjectResponse[] };

        console.log(JSON.stringify(results, null, 2));


        // await db.insertInto('pages').values({
        //     database_id: database.id,
        //     database_alias: database.alias,
        //     page_id: page.id,
        //     body: results,
        //     created_by: page.created_by.id,
        //     updated_by: page.last_edited_by.id,
        //     created_at: page.created_time,
        //     updated_at: page.last_edited_time,
        // }).onConflict(oc => oc.column('page_id').doUpdateSet({
        //     body: (eb) => eb.ref('excluded.body'),
        //     updated_by: (eb) => eb.ref('excluded.updated_by'),
        //     updated_at: (eb) => eb.ref('excluded.updated_at'),
        // })).execute();
    } catch (error) {
        console.error({
            location: 'processPage',
            error,
        });
    }
}