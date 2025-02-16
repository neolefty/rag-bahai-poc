"use client"

import { useState } from "react"
import { DivideIntoChunks } from "@/app/_chunk/divideIntoChunks"
import { SubmitChunks } from "@/app/_chunk/submitChunks"

export default function Home() {
    const [chunks, setChunks] = useState<string[] | undefined>(undefined)
    return (
        <div className="flex flex-col items-center space-y-4 py-5">
            <DivideIntoChunks setChunks={setChunks}/>
            {chunks && (
                <>
                    <hr className="w-full"/>
                    <SubmitChunks chunks={chunks}/>
                </>
            )}
        </div>
    )
}
