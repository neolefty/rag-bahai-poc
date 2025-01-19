import { openai } from "@ai-sdk/openai"
import { CoreUserMessage, generateObject } from "ai"
import { NextResponse } from "next/server"
import { ChunksSchema } from "@/app/_chunk/chunksSchema"
import { CHUNK_SYSTEM_MESSAGE } from "./chunkSystemPrompt"

// Allow streaming up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
    const { document } = await req.json();

    const documentMessage: CoreUserMessage = {
        role: "user",
        content: document,
    }

    const messages = [CHUNK_SYSTEM_MESSAGE, documentMessage]

    const result = await generateObject({
        model: openai('gpt-4-turbo'),
        messages,
        schema: ChunksSchema,
    })

    return NextResponse.json(result.object)
}
