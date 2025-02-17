"use server"

import { z } from "zod"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { BibliographicSchema } from "./bibliographicSchema"
import { LATEST_OPENAI_LOW_MODEL } from "@/lib/llmConstants"
import { db } from "@/db/database"
import { DocumentSummary, NewDocument } from "@/db/dbTypes"
import { SetStep } from "@/lib/stepStatus"

// 1. Load document from a URL
//    * get bibliographic info
//    * store it in database
//    * update — what if it already exists? Compare? Version? For now, throw an error if there are changes.
// 2. Identify blocks by their hashtag URLs
//    * do this deterministically?
//    * derive full URL — is there a way to test it?
//    * store them in database
//    * is there a difference between clean text and raw text?
// 3. Break up blocks into chunks
//    * clean text vs raw text: is embedding better with clean?

// Save document to the database, unless it already exists.
export const extractDocument = async (
    url: string,
    setStep?: SetStep
) => {
    // ensure url is unique
    const existingDocument = await db
        .selectFrom("document")
        .where("url", "=", url)
        .selectAll()
        .executeTakeFirst()
    if (existingDocument) {
        setStep?.("document already exists", true)
    }
    else {
        const document = await loadDocument(url, setStep)
        setStep?.("saving document")
        await db.insertInto("document").values(document).execute()
        // if we want to return the document
        // return await db.insertInto("document").values(document).returningAll().executeTakeFirstOrThrow()
        // or returning('id') to get just the ID
    }
}

// Load a document from a URL, including bibliographic info.
const loadDocument = async (
    url: string,
    setStep?: SetStep
): Promise<NewDocument> => {
    const response = await fetch(url)
    setStep?.("fetching document")
    const raw_html = await response.text() || null
    setStep?.("getting bibliographic info")
    const bibliographic_info = await loadBibliographicInfo(url)
    setStep?.("alphabetizing")
    const alpha_title = await alphabeticalTitle(bibliographic_info.title)

    return {
        url,
        title: bibliographic_info.title,
        alpha_title,
        raw_html,
        bibliographic_info,
    }
}

const alphabeticalTitle = async(title: string) => {
    const aiResponse = await generateObject({
        model: openai(LATEST_OPENAI_LOW_MODEL),
        messages: [{
            role: "user",
            content: `Rearrange this title to make it alphabetize nicely, for example by moving "The" to the end and separating with a comma. Be careful not to drop any words in the process: ${title}"`,

        }],
        schema: z.object({
            title: z.string(),
        })
    })
    return aiResponse.object.title
}

const loadBibliographicInfo = async (url: string) => {
    const aiResponse = await generateObject({
        model: openai(LATEST_OPENAI_LOW_MODEL),
        messages: [{
            role: "user",
            content: `What is the bibliographic information for the book or document represented by this URL? ${url}`,
        }],
        schema: BibliographicSchema,
    })
    return aiResponse.object
}

export const listDocumentSummariesAction = async (): Promise<DocumentSummary[]> => {
    return db.selectFrom("document")
        .select(["id", "title", "url", "bibliographic_info"])
        .orderBy("alpha_title")
        .execute()
    // .selectAll().execute()
}
