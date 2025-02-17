"use client"

import { useCallback, useState } from "react"
import { StepStatus } from "@/lib/stepStatus"
import { SteppedButton } from "@/components/steppedButton"
import { DocumentSummary } from "@/db/dbTypes"

export const DocumentPanel = ({document, mutate, setDocumentUrl}: {
    document: DocumentSummary,
    mutate?: () => void,
    setDocumentUrl?: (documentUrl: string) => void,
}) => {
    const [latestStatus, setLatestStatus] = useState<Partial<StepStatus> | undefined>()
    const setAndDebug = useCallback((status?: Partial<StepStatus>) => {
        console.log(status)
        setLatestStatus(status)
    }, [])
    const documentUrl = document.url
    const mutateAndSetDocumentUrl = useCallback(() => {
        setDocumentUrl?.(documentUrl)
        mutate?.()
    }, [documentUrl, setDocumentUrl, mutate])
    return (
        <div className="flex flex-row gap-2 items-center my-2">
            <a href={document.url} className="text-blue-700 dark:text-blue-400 hover:underline">{document.title}</a>
            <SteppedButton
                api="/api/document/parse"
                payload={{documentId: document.id}}
                setLatestStatus={setAndDebug}
                mutate={mutate}
            >
                Break into blocks
            </SteppedButton>
            <SteppedButton
                api="/api/document/delete"
                payload={{documentId: document.id}}
                setLatestStatus={setAndDebug}
                className="btn-error"
                mutate={mutateAndSetDocumentUrl}
            >
                Delete
            </SteppedButton>
            <div className={latestStatus?.isError ? "text-red-500" : "text-gray-500" + " min-w-12"}>
                {latestStatus?.step}
            </div>
        </div>
    )
}