"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { BibliographicSchema } from "./bibliographicSchema"
import { LATEST_OPENAI_LOW_MODEL } from "@/lib/llmConstants"
import { db } from "@/db/database"
import { NewDocument } from "@/db/dbTypes"
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
    const bibliographic_info = await getBibliographicInfo(url)

    return {
        url,
        title: bibliographic_info.title,
        raw_html,
        bibliographic_info,
    }
}

export const listDocumentsAction = async () => {
    return db.selectFrom("document").selectAll().execute()
}

const getBibliographicInfo = async (url: string) => {
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