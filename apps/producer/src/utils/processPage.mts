
import { BlockObjectResponse, PartialBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import queue from "../connections/bull.mjs";
import notion from "../connections/notion.mjs";


export const processPage = async (page: any) => {
    const { results }: {
        results: (BlockObjectResponse | PartialBlockObjectResponse)[];
    } = await notion.blocks.children.list({
        block_id: page.id,
    });
}