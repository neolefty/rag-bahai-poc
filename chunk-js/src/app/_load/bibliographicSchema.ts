import { z } from "zod"

export const BibliographicSchema = z.object({
    title: z.string(),
    author: z.string(),
    compiler: z.string().optional(),
    translator: z.string().optional(),
    publicationYear: z.number(),
    publisher: z.string().optional(),
    description: z.string().optional(),
    otherInformation: z.string().optional(),
})