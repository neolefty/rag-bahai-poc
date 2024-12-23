import { CoreUserMessage, streamObject } from "ai"
import { CHUNK_SYSTEM_MESSAGE } from "../chunkSystemPrompt"
import { openai } from "@ai-sdk/openai"
import { ChunksSchema } from "../../../chunksSchema"
import { NextResponse } from "next/server"

export const maxDuration = 30

export async function POST(req: Request) {
    const { document } = await req.json();

    const documentMessage: CoreUserMessage = {
        role: "user",
        content: document,
    }

    const messages = [CHUNK_SYSTEM_MESSAGE, documentMessage]

    const aiResponse = streamObject({
        model: openai('gpt-4-turbo'),
        messages,
        schema: ChunksSchema,
    })
    return aiResponse.toTextStreamResponse()
}