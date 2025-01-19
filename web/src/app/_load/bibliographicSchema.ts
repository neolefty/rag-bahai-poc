import { z } from "zod"

export const BibliographicSchema = z.object({
    title: z.string(),
    author: z.string(),
    documentType: z.enum([
        'book', 'letter', 'tablet', 'statement', 'prayer', 'meditation', 'compilation', 'pilgrim note'
        // other possibilities: 'official communication', 'historical narrative', 'administrative directive', 'prayer / meditation'
        // see https://chatgpt.com/share/678d2262-2218-8012-ba37-c3c0a2cf0df2
    ]),
    compiler: z.string().optional(),
    translator: z.string().optional(),
    publicationDate: z.number(),
    publisher: z.string().optional(),
    description: z.string().optional(),
    otherInformation: z.string().optional(),
})