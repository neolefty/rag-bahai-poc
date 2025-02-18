import { Element, Root, RootContent } from "hast"
import { SetStep } from "@/lib/stepStatus"
import { Block, Chunk } from "@/db/dbTypes"

// Split a document into blocks and chunks.
// A block is a document subtree that has its own #id.
// A block may have child blocks, each with their own #id as well.
// Blocks are further divided into chunks, which must be kept linear. So a child's chunks may intersperse with the parent's chunks.
export const breakIntoBlocks = async (
    node: Element,
    setStep: SetStep,
) => {
    await innerBreakIntoBlocks(node, undefined, undefined, setStep)
}

// Recursive helper function for breakIntoBlocks.
const innerBreakIntoBlocks = async (
    node: Element,
    parentBlock: Block | undefined,
    prevChunk: Chunk | undefined,
    setStep: SetStep,
) => {
    // Strategy: depth-first traversal of the tree
    // For each node, if it has an `id`, it is a block

}