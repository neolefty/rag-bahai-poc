import { z } from "zod"

// A streaming status. Array of { step: string, isError?: boolean }.
export const StepStatusSchema =
    z.object({
        step: z.string(),
        isError: z.boolean(),
    })

export const StepStatusesSchema = z.array(StepStatusSchema)

export type StepStatus = z.infer<typeof StepStatusSchema>
export type StepStatuses = z.infer<typeof StepStatusesSchema>

export type SetStep = (step: string, isError?: boolean) => void
type StepsDone = () => void

export type SetStatus = (status?: StepStatus) => void

export const makeSetStep = (
    controller: ReadableStreamDefaultController<unknown>
): [SetStep, StepsDone, StepStatuses] => {
    let isFirst = true
    const stepStatuses:  StepStatuses = []
    return [(
        step: string,
        isError = false,
    ) => {
        stepStatuses.push({step, isError})
        controller.enqueue(`${isFirst ? '[' : ','}${JSON.stringify({step, isError})}`)
        isFirst = false
    }, () => {
        controller.enqueue(']')
    }, stepStatuses]
}