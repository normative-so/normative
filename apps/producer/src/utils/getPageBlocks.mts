import { BlockObjectResponse, PartialBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import notion from "../notion.mjs";

export const getPageBlocks = async (pageId: string): Promise<BlockObjectResponse | PartialBlockObjectResponse[]> => {
    const { results: blocks } = await notion.blocks.children.list({
        block_id: pageId,
    });

    return blocks;
}