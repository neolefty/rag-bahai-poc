import { openai } from "@ai-sdk/openai"
import { CoreSystemMessage, CoreUserMessage, generateObject, streamObject } from "ai"
import { NextResponse } from "next/server"
import { ChunksSchema } from "../../chunksSchema"

// Allow streaming up to 30 seconds
export const maxDuration = 30

const prompt = "Chunk the following text into smaller pieces such as sentences, that each convey an idea. A particularly long or complex sentence should be broken up into fragments, while many short sentences that are closely related can be grouped together. Most important is that the original text should be completely preserved in the chunks."

const promptMessage: CoreSystemMessage = {
    role: "system",
    content: prompt,
}

export async function POST(req: Request) {
    const { document } = await req.json();

    const documentMessage: CoreUserMessage = {
        role: "user",
        content: document,
    }

    const messages = [promptMessage, documentMessage]
    console.log({messages})

    const result = await generateObject({
        model: openai('gpt-4-turbo'),
        messages,
        schema: ChunksSchema,
    })

    return NextResponse.json(result.object)
}

export async function POST_stream(req: Request) {
    const { messages } = await req.json();

    const allMessages = [promptMessage, ...messages]
    console.log(allMessages)

    const result = streamObject({
        model: openai('gpt-4-turbo'),
        messages: [promptMessage, ...messages],
        schema: ChunksSchema,
    })

    return result.toTextStreamResponse()
}