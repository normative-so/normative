
import { BlockObjectResponse, PageObjectResponse, PartialBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import queue from "../connections/bull.mjs";
import notion from "../connections/notion.mjs";
import { writeFileSync } from "fs";
import { db } from "../db/postgres.mjs";


export const processPage = async (page: PageObjectResponse) => {
    const { results }: {
        results: (BlockObjectResponse | PartialBlockObjectResponse)[];
    } = await notion.blocks.children.list({
        block_id: page.id,
    });

    await db.insertInto('pages').values({
        database_id: (page.parent as { database_id: string }).database_id,
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
}