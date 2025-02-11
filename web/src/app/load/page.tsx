"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { experimental_useObject as useObject } from "ai/react"
import { JsonValue } from "type-fest"
import { listDocumentSummariesAction } from "@/app/_load/ExtractDocument"
import { SetStatus, StepStatus, StepStatuses, StepStatusesSchema } from "@/lib/stepStatus"
import { GLEANINGS_URL } from "@/lib/gleanings"
import { DocumentSummary } from "@/db/dbTypes"

const useSteppedApi = (api: string) => {
    const { object: statuses, submit, isLoading } = useObject({
        schema: StepStatusesSchema,
        api,
        initialValue: [],
    })
    const lastStatus = statuses?.[statuses.length - 1]
    // once the API call is complete, only show status if it wasn't an error
    const latestStatus = (lastStatus?.isError || isLoading) ? lastStatus : undefined

    return { latestStatus, submit, isLoading }
}

const useListDocuments = () => {
    return useSWR("listDocumentsAction", listDocumentSummariesAction)
}

export default function Home() {
    const {data: documents, mutate } = useListDocuments()
    const [documentUrl, setDocumentUrl] = useState(GLEANINGS_URL)
    const { latestStatus, submit, isLoading } = useSteppedApi("/api/document/extract")

    const handleSubmit = async () => {
        submit({documentUrl})
    }

    useEffect(() => {
        if (!isLoading)
            mutate()
    }, [isLoading]) // don't make mutate a dependency, or it may fire too frequently

    return (
        <div className="flex flex-col items-center space-y-4 py-5">

            <h1 className="text-2xl">Load a Document</h1>
            <div className="flex flex-row space-x-4 items-center">
                <input
                    type="text"
                    placeholder="Document URL"
                    className="input"
                    value={documentUrl}
                    onChange={e => setDocumentUrl(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSubmit} disabled={!documentUrl || isLoading}>
                    Load
                </button>
                <div className={latestStatus?.isError ? "text-red-500" : "text-gray-500" + " min-w-12"}>
                    {latestStatus?.step}
                </div>
            </div>

            <hr className="w-full border-gray-300" />

            <h2 className="text-xl">Current Documents</h2>
            <ul className="list-disc">
                {documents?.map(document => (
                    <li key={document.id}>
                        <DocumentPanel document={document} />
                    </li>
                ))}
            </ul>

        </div>
    )
}

const DocumentPanel = ({document}: {document: DocumentSummary}) => {
    const [latestStatus, setLatestStatus] = useState<Partial<StepStatus> | undefined>()
    return (
        <div className="flex flex-row space-x-4 items-center my-2">
            <a href={document.url} className="text-blue-700 dark:text-blue-400 hover:underline">{document.title}</a>
            <SteppedButton
                label="Break into blocks"
                api="/api/document/parse"
                payload={{documentId: document.id}}
                setLatestStatus={setLatestStatus}
            />
            <div className={latestStatus?.isError ? "text-red-500" : "text-gray-500" + " min-w-12"}>
                {latestStatus?.step}
            </div>
        </div>
    )
}

type SetPartialStatus = (status?: Partial<StepStatus>) => void

const SteppedButton = ({label, api, payload, setLatestStatus, className}: {
    label: string,
    api: string,
    payload: JsonValue,
    setLatestStatus?: SetPartialStatus,
    className?: string,
}) => {
    const {latestStatus, submit, isLoading} = useSteppedApi(api)
    const handleSubmit = async () => {
        submit(payload)
    }
    useEffect(() => {
        setLatestStatus?.(latestStatus)
    }, [latestStatus, setLatestStatus])
    return (
        <>
            <button
                className={`btn btn-sm btn-neutral ${ className ?? ""}`}
                onClick={handleSubmit}
                disabled={isLoading}
            >
                {label}
            </button>
        </>
    )
}