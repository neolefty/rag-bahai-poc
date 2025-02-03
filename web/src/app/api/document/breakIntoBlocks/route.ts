import { makeStepStreamer } from "@/lib/makeStepStreamer"
import { breakIntoBlocks } from "@/app/_load/TransformDocument"

export async function POST(req: Request) {
    const { documentId } = await req.json()
    if (typeof documentId !== "number")
        return new Response(`Invalid document URL: ${documentId}`, { status: 400 })
    return makeStepStreamer(breakIntoBlocks)(documentId)
}
