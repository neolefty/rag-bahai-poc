"use server"

import { unified } from "unified"
import rehypeParse from "rehype-parse"
import { Root, RootContent, Node } from "hast"
// import rehypeStringify from "rehype-stringify"
import { SetStep } from "@/lib/stepStatus"
import { db } from "@/db/database"
import { Document } from "@/db/dbTypes"

export const breakIntoBlocks = async (
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

    setStep("breaking into blocks")
    // split into blocks, using unified
    // console.log(document.raw_html)
    const tree: Root = unified()
        .use(rehypeParse, {
            fragment: false,
            compressWhitespace: true,
        })
        .parse(`${document.raw_html}`)
    // console.log({tree})
    debugPrint(tree)
    // if (tree.children)
    //     tree.children.forEach((node, i) => {
    //         if (node.type === "text")
    //             console.log({i, nodeType: node.type, value: node.value})
    //         else if (node.type === "element")
    //             console.log({i, nodeType: node.type, tagName: node.tagName})
    //         else
    //             console.log({i, nodeType: node.type})
    //     })

    // const body = tree.children.find(node => node.type === "element" && node.tagName === "body")
    // if (!body) throw new Error(`No body found in document #${document.id} "${document.title}"`)


        // .use(rehypeStringify)
        // .process(`${document.raw_html}`)
        // .parse(document.raw_html)
}

const TEXT_MAX_LENGTH = 80

const debugPrint = (node: Root | RootContent, depth = 0) => {
    const indent = "  ".repeat(depth)
    const shorten = (s: string) =>
        s.length > TEXT_MAX_LENGTH-depth*2
            ? s.slice(0, TEXT_MAX_LENGTH-3-depth*2) + "..."
            : s
    if (node.type === "text") {
        const text = node.value.trim()
        if (text) {
            console.log(`${indent}${node.type}: ${shorten(text)} (${node.value.length})`)
        }
    }
    else if (node.type === "element") {
        const id = node.properties?.id ? `#${node.properties.id}` : ""
        const text = node.children && node.children.length === 1 && node.children[0].type === "text" ? node.children[0].value.trim() : undefined
        const shortText = text ? ` "${shorten(text)}" (${text.length})` : ""
        console.log(`${indent}${node.tagName}${id}${shortText ? `: ${shortText}`: ""}`)
        if (node.children && !shortText) {
            node.children.forEach(child => debugPrint(child, depth + 1))
        }
    }
    else if (node.type === "root") {
        console.log(`${indent}${node.type}`)
        if (node.children) {
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
