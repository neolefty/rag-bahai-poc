import { makeStepStreamer } from "@/lib/makeStepStreamer"
import { db } from "@/db/database"

export async function POST(req: Request) {
    const { documentId } = await req.json()
    if (typeof documentId !== "number")
        return new Response(`Invalid document ID: ${documentId}`, { status: 400 })
    return makeStepStreamer(async (id: number, setStep) => {
        try {
            setStep("deleting chunks")
            await db.deleteFrom("chunk").where("block_id", "in", db.selectFrom("block").where("document_id", "=", id).select("id")).execute()
            setStep("deleting blocks")
            await db.deleteFrom("block").where("document_id", "=", id).execute()
            setStep("deleting document")
            await db.deleteFrom("document").where("id", "=", id).execute()
        }
        catch (e) {
            console.error(e)
            setStep(`failed to delete: ${e}`)
        }
    })(documentId)
}