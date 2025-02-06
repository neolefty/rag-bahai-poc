import { makeSetStep, SetStep } from "@/lib/stepStatus"

// Create an API endpoint that streams progress updates through its Response, and can be listened to with the AI SDK's experimental_useObject.
type steppedFunction<ParameterType> = (p: ParameterType, setStep: SetStep) => Promise<void>
export const makeStepStreamer = <ParameterType>(f: steppedFunction<ParameterType>) => {
    return async (p: ParameterType) => {
        // based on https://youtu.be/_Rb4SpWRHC8?si=rirB2yxL9HNOtqae&t=900
        const stream = new ReadableStream({
            async start(controller) {
                // const [setStep, stepsDone] = makeSetStep(controller)
                const [setStep, stepsDone, steps] = makeSetStep(controller)
                await f(p, setStep)
                const lastStep = steps.length ? steps[steps.length - 1] : undefined
                console.log({lastStep, p})
                stepsDone()
                controller.close()
            }
        })

        return new Response(stream, {
            headers: {
                "Content-Type": "application/json",
                "Transfer-Encoding": "chunked",
            },
        })
    }
}