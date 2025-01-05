"use client"

import { useCallback, useState } from "react"
import { GLEANINGS_I } from "./gleaningsOne"
import { experimental_useObject as useObject } from "ai/react"
import { ChunksSchema } from "./chunksSchema"
import { Diff } from "../components/diff"

export const ChunkTest = () => {
    const [document, setDocument] = useState(GLEANINGS_I)

    const {object, submit, isLoading } = useObject({
        schema: ChunksSchema,
        api: "/api/chunk/streaming",
        initialValue: {chunks: []},
    })

    const handleReset = useCallback(() => {
        setDocument(GLEANINGS_I)
    }, [])

    const chunks = object?.chunks ?? []

    return (
        <>
            <label htmlFor="document" className="text-2xl">
                Document to be chunked
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
                    Chunk
                </button>
                <button type="button" className="btn btn-neutral" onClick={handleReset} disabled={isLoading}>
                    Reset
                </button>
            </div>
            {chunks.length > 0 && (
                <>
                    <hr className="w-full" />
                    <h2 className="text-2xl">Chunks</h2>
                    <ol className="w-[80vw] sm:max-w-[40rem] list-decimal">
                        {chunks.map((chunk, i) => (
                            <li key={i} className="mb-1">{chunk}</li>
                        ))}
                    </ol>
                </>
            )}
            <Diff a={document} b={chunks.join(" ")} />
        </>
    )
}