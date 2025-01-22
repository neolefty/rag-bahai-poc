import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { BibliographicSchema } from "./bibliographicSchema"
import { LATEST_OPENAI_LOW_MODEL } from "@/lib/llmConstants"

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

const loadDocument = async (
    url: string,
    update?: (step: string) => void
) => {
    const response = await fetch(url)
    update?.("fetching document")
    const rawHtml = await response.text()
    update?.("getting bibliographic info")
    const bibliographicInfo = await getBibliographicInfo(url)

    return rawHtml
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