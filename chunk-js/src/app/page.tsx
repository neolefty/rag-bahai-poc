"use client"

import { DivideIntoChunks } from "./divideIntoChunks"
import { useState } from "react"
import { SubmitChunks } from "./submitChunks"

export default function Home() {
    const [chunks, setChunks] = useState<string[] | undefined>(undefined)
    return (
        <div className="flex flex-col items-center space-y-4 py-5">
            <DivideIntoChunks setChunks={setChunks}/>
            <hr className="w-full"/>
            {chunks && <SubmitChunks chunks={chunks}/>}
        </div>
    )
}
