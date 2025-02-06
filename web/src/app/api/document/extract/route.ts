import { extractDocument } from "@/app/_load/ExtractDocument"
import { makeStepStreamer } from "@/lib/makeStepStreamer"

// it can take a long time to download a document
export const maxDuration = 300

export async function POST(req: Request) {
    const { documentUrl } = await req.json()
    if (typeof documentUrl !== "string")
        return new Response(`Invalid document URL: ${documentUrl}`, { status: 400 })
    return makeStepStreamer(extractDocument)(documentUrl)
}
