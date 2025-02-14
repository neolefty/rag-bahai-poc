"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { listDocumentSummariesAction } from "@/app/_load/ExtractDocument"
import { GLEANINGS_URL } from "@/lib/gleanings"
import { useSteppedApi } from "@/lib/useSteppedApi"
import { DocumentPanel } from "@/app/load/documentPanel"

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
        if (!isLoading) mutate()
    }, [isLoading, mutate])

    return (
        <div className="flex flex-col items-center space-y-4 py-5">

            <h1 className="text-2xl">Load a Document</h1>
            <div className="flex flex-row space-x-4 items-center">
                <input
                    type="text"
                    placeholder="Document URL"
                    className="input w-[60vw] text-right"
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
                        <DocumentPanel
                            document={document}
                            mutate={mutate}
                            setDocumentUrl={setDocumentUrl}
                        />
                    </li>
                ))}
            </ul>

        </div>
    )
}
