import { Blocks } from "../../db/types.mjs";

export type NestedBlock = Blocks & { children: NestedBlock[] };


export const buildNestedBlocks = (blocks: Blocks[], parent_id?: string) => {
    const childrens = blocks.filter((block) => (block.parent_id == parent_id));

    const nestedBlocks = childrens.map((children): NestedBlock => ({
        ...children,
        children: buildNestedBlocks(blocks, children.block_id) // Recursive call
    }));

    return nestedBlocks;
}