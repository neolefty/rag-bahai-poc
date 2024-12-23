import { CoreSystemMessage } from "ai"

const CHUNK_SYSTEM_PROMPT = "Chunk the following text into smaller pieces such as sentences, that each convey an idea. A particularly long or complex sentence should be broken up into fragments, while many short sentences that are closely related can be grouped together. Most important is that the original text should be completely preserved in the chunks."

export const CHUNK_SYSTEM_MESSAGE: CoreSystemMessage = {
    role: "system",
    content: CHUNK_SYSTEM_PROMPT,
}