import { experimental_useObject as useObject } from "ai/react"
import { StepStatusesSchema } from "@/lib/stepStatus"

export const useSteppedApi = (api: string) => {
    const {object: statuses, submit, isLoading} = useObject({
        schema: StepStatusesSchema,
        api,
        initialValue: [],
    })
    const lastStatus = statuses?.[statuses.length - 1]
    // once the API call is complete, only show status if it wasn't an error
    const latestStatus = (lastStatus?.isError || isLoading) ? lastStatus : undefined

    return {latestStatus, submit, isLoading}
}