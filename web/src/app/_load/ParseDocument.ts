"use server"

import { unified } from "unified"
import rehypeParse from "rehype-parse"
import rehypeSanitize from "rehype-sanitize"
import { Root, RootContent, Element } from "hast"
// import rehypeStringify from "rehype-stringify"
import { SetStep } from "@/lib/stepStatus"
import { db } from "@/db/database"
import { Document } from "@/db/dbTypes"

// Load a document from the database, parse its HTML, extract meta tags, break into blocks, and extract text.
export const parseDocument = async (
    doc: Document | number,
    setStep: SetStep,
) => {
    // load document, if necessary
    let document: Document | undefined = undefined
    if (typeof doc === "number") {
        setStep("loading document")
        document = await db.selectFrom("document").where("id", "=", doc).selectAll().executeTakeFirstOrThrow()
    }
    else {
        document = doc
    }
    if (!document) throw new Error("Document not found") // shouldn't happen — already threw when loading from DB

    setStep("parsing document")
    // split into blocks, using unified
    const tree: Root = unified()
        .use(rehypeParse, {
            fragment: false,
            compressWhitespace: true,
        })
        .use(rehypeSanitize)
        .parse(`${document.raw_html}`)

    const body = findBody(tree)
    if (!body) throw new Error("No body found")

    await breakIntoBlocks(body, setStep)

    debugPrint(tree)

    const oldMeta = document.bibliographic_info.metaTags ?? {}
    const newMeta = {
        ...oldMeta,
        ...extractMetaTags(tree),
    }
    console.log({ newMeta })
    if (JSON.stringify(oldMeta) !== JSON.stringify(newMeta)) {
        setStep("updating meta tags")
        await db.updateTable("document").set({
            bibliographic_info: {
                ...document.bibliographic_info,
                metaTags: newMeta,
            },
        }).where("id", "=", document.id).execute()
    }

        // .use(rehypeStringify)
        // .process(`${document.raw_html}`)
        // .parse(document.raw_html)
}

const findBody = (node: Element | Root): Element | undefined => {
    if (node.type === "element" && node.tagName === "body") return node
    for (const child of node.children) {
        if (child.type === "element") {
            const result = findBody(child)
            if (result) return result
        }
    }
}

// A block is a document fragment that has its own #id.
const breakIntoBlocks = async (node: Element, setStep: SetStep) => {
    // Strategy: depth-first traversal of the tree, keeping track of parent tags
    // For each node, if it has an `id`, it is a block
    // But if it contains blocks, we need to separate them out, and not include their text in the parent block
    // Problem: That could change the order of the text.
    // Solution: Don't support blocks within blocks — only split on top-level blocks
    // TODO: support hashtags partway through blocks, and link to the most recent hashtag
}

const extractMetaTags = (root: Root) => {
    const meta: Record<string, string> = {}
    const html = root.children.find(node => node.type === "element" && node.tagName === "html") ?? root
    if (html.type !== "element") {
        console.error("no html found")
        return meta
    }

    const head = html.children.find(node => node.type === "element" && node.tagName === "head")
    if (head && head.type === "element") {
        if (head.children) {
            for (const child of head.children) {
                if (child.type === "element" && child.tagName === "meta") {
                    const name = child.properties?.name as string | undefined
                    const content = child.properties?.content as string | undefined
                    if (name && content) {
                        meta[name] = content
                    }
                }
            }
        }
    }
    return meta
}

const TEXT_MAX_WIDTH = 80

const debugPrint = (node: Root | RootContent, depth = 0) => {
    const indent = "  ".repeat(depth)
    const shorten = (s: string) =>
        s.length > TEXT_MAX_WIDTH-depth*2
            ? s.slice(0, TEXT_MAX_WIDTH-3-depth*2) + "..."
            : s

    if (node.type === "text") {
        const text = node.value.trim()
        if (text) console.log(`${indent}${node.type}: ${shorten(text)} (${node.value.length})`)
    }

    else if (node.type === "element") {
        const id = node.properties?.id ? `#${node.properties.id}` : ""
        let className = node.properties?.className
        const classes = Array.isArray(className) ? className.join(".") : className
        const text = node.children && node.children.length === 1 && node.children[0].type === "text" ? node.children[0].value.trim() : undefined
        const shortText = text ? ` "${shorten(text)}" (${text.length})` : ""
        console.log(`${indent}${node.tagName}${id}${shortText ? `: ${shortText}`: ""}${classes ? `.${classes}` : ""}`)
        if (node.children && !shortText) {
            node.children.forEach(child => debugPrint(child, depth + 1))
        }
    }

    else if (node.type === "root") {
        if (node.children) {
            console.log(`${indent}${node.type}`)
            node.children.forEach(child => debugPrint(child, depth + 1))
        }
    }

    else {
        console.log(`${indent}${node.type}`)
    }
}

// const findBody = (node: Node) => {
//     if (node.type === "element" && node.tagName === "body") return node
// }
