"use server"

import { db } from "../db/database"

export async function submitChunks(title: string, chunks: string[]) {
    // 1. Find or create a document with the given title
    // Note this is a good reason to switch to Supabase, which supports upsert: https://supabase.com/docs/reference/javascript/upsert
    let document = await db.selectFrom("document").where("title", "=", title).executeTakeFirst()
    if (!document)
        document = await db.insertInto("document").values({title}).execute()
    console.log({document})
}