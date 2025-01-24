"use client"

import useSWR from "swr"
import { listDocumentsAction } from "@/app/_load/ExtractDocument"

const useListDocuments = () => {
    return useSWR("listDocumentsAction", listDocumentsAction)
}

export default function Home() {
    const {data: documents} = useListDocuments()
    return (
        <div className="flex flex-col items-center space-y-4 py-5">
            <h1 className="text-2xl">Load Documents</h1>
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
