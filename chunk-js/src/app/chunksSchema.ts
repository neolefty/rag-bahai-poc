import { z } from "zod"

export const ChunksSchema = z.object({
    chunks: z.array(z.string()).optional(),
})