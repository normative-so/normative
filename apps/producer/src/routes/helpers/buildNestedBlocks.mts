import { Blocks } from "../../db/types.mjs";

export type NestedBlock = Blocks & { children: NestedBlock[] };


export const buildNestedBlocks = (blocks: Blocks[], parent_id?: string) => {
    const nestedBlocks: NestedBlock[] = [];

    const childrens = blocks.filter((block) => (block.parent_id == parent_id));

    for (const children of childrens) {
        nestedBlocks.push({
            ...children,
            children: buildNestedBlocks(blocks, children.block_id)
        });
    }

    return nestedBlocks;
}