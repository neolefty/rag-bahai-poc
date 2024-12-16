'use client'

import { experimental_useObject as useObject } from "ai/react"
import { useCallback, useState } from "react"
import { ChunksSchema } from "./chunksSchema"
import { GLEANINGS_I } from "./gleaningsOne"
import { diffWords } from "diff"

export default function Home() {
    const [document, setDocument] = useState(GLEANINGS_I)

    const {object, submit, isLoading } = useObject({
        schema: ChunksSchema,
        api: "/api/chunk",
        initialValue: {chunks: []},
    })

    const handleReset = useCallback(() => {
        setDocument(GLEANINGS_I)
    }, [])

    const chunks = object?.chunks ?? []

    return (
        <div className="flex flex-col items-center space-y-4 py-5">
            <label htmlFor="document" className="text-xl">
                Document to be chunked:
            </label>
            <textarea
                id="document"
                name="document"
                rows={10}
                className="w-[80vw] sm:max-w-[40rem]"
                value={document}
                onChange={e => setDocument(e.target.value)}
            />
            <div className="flex gap-4">
                <button
                    className="btn btn-primary"
                    disabled={isLoading || !document?.trim()}
                    onClick={() => submit({document})}
                >
                    Chunk this text
                </button>
                <button type="button" className="btn btn-neutral" onClick={handleReset} disabled={isLoading}>
                    Reset
                </button>
            </div>
            {chunks.length > 0 && (
                <>
                    <hr className="w-full" />
                    <h2 className="text-xl">Chunks:</h2>
                    <ol className="w-[80vw] sm:max-w-[40rem] list-decimal">
                        {chunks.map((chunk, i) => (
                            <li key={i} className="mb-1">{chunk}</li>
                        ))}
                    </ol>
                </>
            )}
            <Diff a={document} b={chunks.join(" ")} />
        </div>
    )
}

const Diff = ({a, b}: {a: string, b: string}) => {
    const changes = diffWords(a, b)
    return (
        <div className="w-[80vw] sm:max-w-[40rem]">
            <h2 className="text-xl">Changes:</h2>
            <ul>
                {changes.map((change, i) => (
                    <li key={i} className={change.added ? "text-green-600" : change.removed ? "text-red-600" : "text-gray-400"}>
                        {change.value}
                    </li>
                ))}
            </ul>
        </div>
    )
}