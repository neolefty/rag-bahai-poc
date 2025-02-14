import { StepStatus } from "@/lib/stepStatus"
import { useSteppedApi } from "@/lib/useSteppedApi"
import { useEffect, useState } from "react"
import { JsonValue } from "type-fest"

type SetPartialStatus = (status?: Partial<StepStatus>) => void

interface SteppedButtonProps {
    children: React.ReactNode,
    api: string,
    payload: JsonValue,
    setLatestStatus?: SetPartialStatus,
    mutate?: () => void,
    className?: string,
}

// A button that submits a request to an endpoint that returns a stream of status updates.
export const SteppedButton = (
    {children, api, payload, setLatestStatus, mutate, className}: SteppedButtonProps
) => {
    const {latestStatus, submit, isLoading} = useSteppedApi(api)
    const [submitted, setSubmitted] = useState(false)
    const handleSubmit = async () => {
        submit(payload)
        setSubmitted(true)
    }
    useEffect(() => {
        setLatestStatus?.(latestStatus)
    }, [latestStatus, setLatestStatus])
    useEffect(() => { // refresh when loading is done
        if (!isLoading && submitted) {
            mutate?.()
            setSubmitted(false)
        }
    }, [isLoading, submitted, mutate])
    return (
        <>
            <button
                className={`btn btn-sm btn-neutral ${className ?? ""}`}
                onClick={handleSubmit}
                disabled={isLoading}
            >
                {children}
            </button>
        </>
    )
}