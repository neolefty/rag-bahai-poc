import { Generated, Insertable, JSONColumnType, Selectable, Updateable } from "kysely"

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

    url: string | null
    title: string
    raw_html: string | null
    raw_text: string | null
}

export type Document = Selectable<DocumentTable>
export type NewDocument = Insertable<DocumentTable>
export type UpdateDocument = Updateable<DocumentTable>

// A piece of a document that has its own URL.
export interface BlockTable {
    id: Generated<number>
    document_id: number
    title: string

    raw_html: string | null
    raw_text: string | null
    clean_text: string
    order: number
    // next_block_id & prev_block_id — okay if they're implied by order?

    metadata: JSONColumnType<{
        url: string | null
        bibliographic_info: object | null
    }>
}

export type Block = Selectable<BlockTable>
export type NewBlock = Insertable<BlockTable>
export type UpdateBlock = Updateable<BlockTable>

// A chunk of meaningful text within a block — for example a single sentence.
// There may be multiple sizes of chunks, for vector indexing at different granularities.
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
    identifier: string // the vendor's name for this, for example "gpt-4-turbo"
    model_type: "embedding" | "generation" | "reranking" // etc
    model_key_var: string | null // name of the environment variable that holds the key
}

export type LanguageModel = Selectable<LanguageModelTable>
export type NewLanguageModel = Insertable<LanguageModelTable>
export type UpdateLanguageModel = Updateable<LanguageModelTable>