"use server"

import { RawBuilder, sql } from "kysely"
import { db } from "@/db/database"
import { Document } from "@/db/dbTypes"

export async function submitChunks(title: string, chunks: string[]) {
    const document = await getOrCreateDocument(title)
    const block = await getOrCreateDegenerateBlock(document, title)
    const chunkGenerator = await getOrCreatePlaceholderChunkGenerator()
    const chunkObjects = chunks.map((clean_text, order) => ({
        clean_text,
        raw_text: clean_text,
        order,
        block_id: block.id,
        chunk_generator_id: chunkGenerator.id,
    }))
    await db.insertInto("chunk").values(chunkObjects).execute()
}

function json<T>(value: T): RawBuilder<T> {
    return sql`CAST(${JSON.stringify(value)} AS JSONB)`
}

export async function getOrCreateDegenerateBlock(document: Document, title: string) {
    let block = await db
        .selectFrom("block")
        .where("document_id", "=", document.id)
        .where("title", "=", title)
        .selectAll()
        .executeTakeFirst()
    if (!block)
        block = await db
            .insertInto("block")
            .values({
                document_id: document.id,
                title,
                clean_text: "",
                order: 0,
                metadata: json({url: null, bibliographic_info: null}),
            })
            .returningAll()
            .executeTakeFirstOrThrow()
    return block
}

// todo turn a document into blocks and blocks into chunks

// Find or create a document with the given title
const getOrCreateDocument = async (title: string) => {
    // Note this is a good reason to switch to Supabase, which supports upsert: https://supabase.com/docs/reference/javascript/upsert
    let document = await db
        .selectFrom("document")
        .where("title", "=", title)
        .selectAll()
        .executeTakeFirst()
    if (!document)
        document = await db
            .insertInto("document")
            .values({title})
            .returningAll()
            .executeTakeFirstOrThrow()
    // const allDocs = await db.selectFrom("document").selectAll().execute()
    // console.log({title, document, allDocs})
    return document
}

const getOrCreatePlaceholderChunkGenerator = async () => {
    let chunkGenerator = await db
        .selectFrom("chunk_generator")
        .where("short_description", "=", "placeholder")
        .selectAll()
        .executeTakeFirst()
    if (!chunkGenerator) {
        const languageModel = await getOrCreatePlaceholderLanguageModel()
        chunkGenerator = await db
            .insertInto("chunk_generator")
            .values({
                short_description: "placeholder",
                system_prompt: "Chop it up into individual sentences.",
                language_model_id: languageModel.id,
            })
            .returningAll()
            .executeTakeFirstOrThrow()
    }
    return chunkGenerator
}

const getOrCreatePlaceholderLanguageModel = async () => {
    let languageModel = await db
        .selectFrom("language_model")
        .where("vendor", "=", "placeholder")
        .selectAll()
        .executeTakeFirst()
    if (!languageModel)
        languageModel = await db
            .insertInto("language_model")
            .values({
                vendor: "placeholder",
                identifier: "placeholder",
                model_type: "embedding",
            })
            .returningAll()
            .executeTakeFirstOrThrow()
    return languageModel
}