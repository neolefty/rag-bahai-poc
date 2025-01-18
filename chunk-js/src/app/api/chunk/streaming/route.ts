import { CoreUserMessage, streamObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { CHUNK_SYSTEM_MESSAGE } from "@/app/api/chunk/chunkSystemPrompt"
import { ChunksSchema } from "@/app/_chunk//chunksSchema"

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