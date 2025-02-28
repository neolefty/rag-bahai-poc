import { htmlToText } from "html-to-text"
import { unified } from "unified"
import rehypeParse from "rehype-parse"
import rehypeSanitize from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import rehypeDocument from "rehype-document"
import { Element, Root, RootContent } from "hast"
import { SetStep } from "@/lib/stepStatus"
import { Block, Chunk, Document, NewBlock } from "@/db/dbTypes"
import { db } from "@/db/database"

interface BreakIntoBlocksArgs {
    document: Document
    node: Element
    setStep: SetStep
}

// Split a document into blocks and chunks.
// A block is a document subtree that has its own #id.
// A block may have child blocks, each with their own #id as well.
// Blocks are further divided into chunks, which must be kept linear. So a child's chunks may intersperse with the parent's chunks.
export const breakIntoBlocks = async (
    { document, node, setStep }: BreakIntoBlocksArgs
) => {
    const progress = {
        blockCount: 0,
        lastStepTime: Date.now(),
    }
    await innerBreakIntoBlocks({node, document, setStep, progress})
}

interface InnerBreakIntoBlocksArgs extends BreakIntoBlocksArgs {
    parentBlock?: Block
    prevSiblingBlock?: Block
    prevChunk?: Chunk
    progress: {
        blockCount: number,
        lastStepTime: number,
    }
}

// A hashtag
const getBlockId = (node: Element): string => {
    const result = node.properties?.name ?? node.properties?.id
}

// Recursive helper function for breakIntoBlocks.
const innerBreakIntoBlocks = async (
    { document, node, parentBlock, prevSiblingBlock, prevChunk, setStep, progress }: InnerBreakIntoBlocksArgs
): Promise<Block | void> => {
    // TODO: if no parent block, create one for the overall document
        
    // Strategy: depth-first traversal of the tree
    // For each node, if it has an `id`, it is a block

    let block: NewBlock | undefined = undefined

    // TODO extract text and detect overlap
    // TODO automated testing
    // TODO identify blocks that aren't really part of the text — navigation, etc.
    // TODO should forward, introduction, etc be searchable? Maybe store but flag as secondary?
    // TODO consider agentic approach: https://youtu.be/wAioL-E5SAQ?si=D7I3YOEKaAafnI6O&t=451 — possible agent frameworks AutoGen, CrewAI, LangGraph

    let currentBlock: Block | undefined = undefined
    if (node.properties?.id) {
        // synthetic root to satisfy rehype
        const root = {
            type: "root",
            children: [node]
        }
        const raw_html_vfile = await unified().use(rehypeParse).use(rehypeStringify).process(root)
        const raw_html = raw_html_vfile.toString()
        const clean_text = htmlToText(raw_html, {
            wordwrap: false,
            baseElements: {
                selectors: ["*"]
            },
        })
        block = {
            document_id: document.id,
            parent_block_id: parentBlock?.id,
            title: parentBlock?.title ?? document.title, // TODO derive from node
            url: deriveBlockUrl(document.url, `${node.properties.id}`),
            raw_html,
            clean_text,
            order: prevSiblingBlock ? prevSiblingBlock.order + 1 : 0,
            bibliographic_info: document.bibliographic_info, // TODO should be any different from parent?
        }
        currentBlock = await db.insertInto("block").values(block).returningAll().executeTakeFirstOrThrow()
        progress.blockCount++
        if (progress.blockCount % 10 === 0) {
            const now = Date.now()
            const elapsed = now - progress.lastStepTime
            if (elapsed > 100) { // update at most every 100 ms
                setStep(`saved ${progress.blockCount} blocks`)
                progress.lastStepTime = now
            }
        }
    }
    // recurse
    for (const child of node.children) {
        // What is a sibling block? Here, they are blocks descended from the same parent.
        // They may not be at the same level of the tree, since not every node has an `id`.
        let prevSiblingBlock: Block | undefined = undefined
        if (child.type === "element") {
            prevSiblingBlock = await innerBreakIntoBlocks({
                document,
                node: child,
                setStep,
                parentBlock: currentBlock ?? parentBlock,
                prevSiblingBlock,
                prevChunk,  // TODO figure out proper value for prevChunk
                progress
            }) ?? prevSiblingBlock
        }
    }
    return currentBlock
}

const BAHAI_REFERENCE_LIBRARY_URL_PREFIX = "https://www.bahai.org/library/authoritative-texts/"
const BAHAI_REFERENCE_URL_BASE = "https://www.bahai.org/r/"

// Derive a block's URL from the document URL and the block's ID.
const deriveBlockUrl = (documentUrl: string, blockId: string) => {
    const split = documentUrl.split("#")
    if (documentUrl.startsWith(BAHAI_REFERENCE_LIBRARY_URL_PREFIX))
        // Special case: Bahá'í Reference Library shortened URLs
        return `${BAHAI_REFERENCE_URL_BASE}${blockId}`
    else
        return `${split[0]}#${blockId}`
}