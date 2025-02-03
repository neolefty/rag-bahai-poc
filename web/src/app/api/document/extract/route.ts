import { extractDocument } from "@/app/_load/ExtractDocument"
import { makeStepStreamer } from "@/lib/makeStepStreamer"

// it can take a long time to download a document
export const maxDuration = 300

// export async function POST(req: Request) {
//     const { documentUrl } = await req.json()
//     // based on https://youtu.be/_Rb4SpWRHC8?si=rirB2yxL9HNOtqae&t=900
//     const stream = new ReadableStream({
//         async start(controller) {
//             const [setStep, stepsDone, steps] = makeSetStep(controller)
//             await extractDocument(documentUrl, setStep)
//             const lastStep = steps.length ? steps[steps.length - 1] : undefined
//             console.log({ lastStep, documentUrl })
//             stepsDone()
//             controller.close()
//         }
//     })
//
//     return new Response(stream, {
//         headers: {
//             "Content-Type": "application/json",
//             "Transfer-Encoding": "chunked",
//         },
//     })
// }
//

export async function POST(req: Request) {
    const { documentUrl } = await req.json()
    if (typeof documentUrl !== "string")
        return new Response(`Invalid document URL: ${documentUrl}`, { status: 400 })
    return makeStepStreamer(extractDocument)(documentUrl)
}
