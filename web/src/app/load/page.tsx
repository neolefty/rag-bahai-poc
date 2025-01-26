"use client"

import { useState } from "react"
import useSWR from "swr"
import { experimental_useObject as useObject } from "ai/react"
import { listDocumentsAction } from "@/app/_load/ExtractDocument"
import { StepStatusSchema } from "@/lib/stepStatus"
import { GLEANINGS_URL } from "@/lib/gleanings"

const useSteppedApi = (api: string) => {
    const { object: statuses, submit, isLoading } = useObject({
        schema: StepStatusSchema,
        api,
        initialValue: [],
    })
    const lastStatus = statuses?.[statuses.length - 1]
    // once the API call is complete, only show status if it wasn't an error
    const latestStatus = (lastStatus?.isError || isLoading) ? lastStatus : undefined

    return { latestStatus, submit, isLoading }
}

const useListDocuments = () => {
    return useSWR("listDocumentsAction", listDocumentsAction)
}

export default function Home() {
    const {data: documents, mutate } = useListDocuments()
    const [documentUrl, setDocumentUrl] = useState(GLEANINGS_URL)
    const { latestStatus, submit, isLoading } = useSteppedApi("/api/document/extract")

    const handleSubmit = async () => {
        submit({documentUrl})
    }

    // const [step, setStep] = useState({
    //     step: "",
    //     isError: false,
    // })
    // const handleSubmit = async () => {
    //     // TODO convert this to a streamObject style function
    //     await extractDocumentAction(url, (step, isError) =>
    //         setStep({step, isError: !!isError})
    //     )
    //     if (!step.isError) {
    //         setStep({step: "reloading", isError: false})
    //         setUrl("")
    //     }
    //     await mutate()
    // }

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
                <button className="btn btn-primary" onClick={handleSubmit} disabled={!documentUrl}>
                    Load
                </button>
                <div className={latestStatus?.isError ? "text-red-500" : "text-gray-500" + " min-w-12"}>
                    {latestStatus?.step}
                </div>
            </div>
            {/*<p className={step.isError ? "text-red-500" : "text-gray-500"}>{step.step}</p>*/}

            <hr className="w-full border-gray-300" />

            <h2 className="text-xl">Current Documents</h2>
            <ul className="list-disc">
                {documents?.map(document => (
                    <li key={document.id}>
                        {document.title}
                    </li>
                ))}
            </ul>

        </div>
    )
}
