import { z } from "zod"
import { Generated, Insertable, Selectable, Updateable } from "kysely"
import { BibliographicSchema } from "@/app/_load/bibliographicSchema"

export interface Database {
    document: DocumentTable
    block: BlockTable
    chunk: ChunkTable
    embedding: EmbeddingTable
    chunk_generator: ChunkGeneratorTable
    language_model: LanguageModelTable
}

// A document such as a book which contains blocks of text.
export interface DocumentTable {
    id: Generated<number>

    url: string
    title: string
    alpha_title: string | null
    raw_html: string | null
    clean_html: string | null
    raw_text: string | null
    bibliographic_info: z.infer<typeof BibliographicSchema>
    // bibliographic_info: JSONColumnType<z.infer<typeof BibliographicSchema>>
}

export type Document = Selectable<DocumentTable>
export type DocumentSummary = Pick<Document, "id" | "title" | "url" | "bibliographic_info">
export type NewDocument = Insertable<DocumentTable>
export type UpdateDocument = Updateable<DocumentTable>

// A subtree of a document that has its own URL.
// Note that a block may contain child blocks, in which case care must be taken to preserve the order of chunks,
// since chunks in child blocks may intersperse the parent's chunks.
export interface BlockTable {
    id: Generated<number>
    document_id: number
    parent_block_id: number | null

    // may be same as the document title
    title: string
    url: string

    raw_html: string | null
    clean_html: string | null
    raw_text: string | null
    clean_text: string
    order: number // TODO: Now that we have a tree structure, how would this work?
    // next_block_id & prev_block_id — okay if they're implied by order?

    // same or different from parent document
    bibliographic_info: z.infer<typeof BibliographicSchema>
    // bibliographic_info: JSONColumnType<z.infer<typeof BibliographicSchema>>
}

export type Block = Selectable<BlockTable>
export type NewBlock = Insertable<BlockTable>
export type UpdateBlock = Updateable<BlockTable>

// A chunk of meaningful text within a block — for example a single sentence.
// There may be multiple sizes of chunks, for vector indexing at different levels of granularity.
export interface ChunkTable {
    id: Generated<number>
    block_id: number
    chunk_generator_id: number

    raw_text: string
    clean_text: string
    order: number
    prev_chunk_id: number | null
    next_chunk_id: number | null
}

export type Chunk = Selectable<ChunkTable>
export type NewChunk = Insertable<ChunkTable>
export type UpdateChunk = Updateable<ChunkTable>

// A vector representation of a chunk of text.
export interface EmbeddingTable {
    id: Generated<number>
    chunk_id: number
    // what embedding model was used to generate this vector?
    language_model_id: number

    vector: number[]
}

export type Embedding = Selectable<EmbeddingTable>
export type NewEmbedding = Insertable<EmbeddingTable>
export type UpdateEmbedding = Updateable<EmbeddingTable>

// A method to generate chunks from a block.
export interface ChunkGeneratorTable {
    id: Generated<number>

    short_description: string // unique
    // instructions to the model for this chunking strategy
    system_prompt: string
    language_model_id: number
}

export type ChunkGenerator = Selectable<ChunkGeneratorTable>
export type NewChunkGenerator = Insertable<ChunkGeneratorTable>
export type UpdateChunkGenerator = Updateable<ChunkGeneratorTable>

// Language models used for embeddings, chunking, generation, etc.
export interface LanguageModelTable {
    id: Generated<number>

    vendor: string
    identifier: string // the vendor's name for this, for example "gpt-4o-mini"
    model_type: "embedding" | "generation" | "reranking" // etc
    model_key_var: string | null // name of the environment variable that holds the key
}

export type LanguageModel = Selectable<LanguageModelTable>
export type NewLanguageModel = Insertable<LanguageModelTable>
export type UpdateLanguageModel = Updateable<LanguageModelTable>