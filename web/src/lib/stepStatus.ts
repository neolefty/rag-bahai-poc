import { z } from "zod"

// A streaming status. Array of { step: string, isError?: boolean }.
export const StepStatusSchema =
    z.array(
        z.object({
            step: z.string(),
            isError: z.boolean(),
        })
    )

type StepStatus = z.infer<typeof StepStatusSchema>

export type SetStep = (step: string, isError?: boolean) => void
type StepsDone = () => void

export const makeSetStep = (
    controller: ReadableStreamDefaultController<unknown>
): [SetStep, StepsDone, StepStatus] => {
    let isFirst = true
    const stepStatus:  StepStatus = []
    return [(
        step: string,
        isError = false,
    ) => {
        stepStatus.push({step, isError})
        controller.enqueue(`${isFirst ? '[' : ','}${JSON.stringify({step, isError})}`)
        isFirst = false
    }, () => {
        controller.enqueue(']')
    }, stepStatus]
}