import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import notion from "../connections/notion.mjs";

type BlockObjectResponseWithChildren = BlockObjectResponse & {
    children: BlockObjectResponseWithChildren[];
}

export const getNestedBlocks = async (block_id: string): Promise<BlockObjectResponseWithChildren[]> => {
    try {
        const { results } = await notion.blocks.children.list({
            block_id,
        }) as { results: BlockObjectResponse[] };

        const blocksWithChildren = await Promise.all(results.map(async (block) => {
            if (block.has_children) {
                const children = await getNestedBlocks(block.id);
                return {
                    ...block,
                    children: children,
                }
            }

            return {
                ...block,
                children: [],
            };
        }))



        return blocksWithChildren;
    } catch (error) {
        console.error({
            location: 'getNestedBlocks',
            error,
        });

        return [];
    }
}