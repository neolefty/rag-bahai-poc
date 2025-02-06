import { makeStepStreamer } from "@/lib/makeStepStreamer"
import { parseDocument } from "@/app/_load/ParseDocument"

export async function POST(req: Request) {
    const { documentId } = await req.json()
    if (typeof documentId !== "number")
        return new Response(`Invalid document ID: ${documentId}`, { status: 400 })
    return makeStepStreamer(parseDocument)(documentId)
}
