import { useCallback, useEffect, useMemo, useState } from "react"
import { experimental_useObject as useObject } from "ai/react"
import { GLEANINGS_I } from "@/lib/gleanings"
import { ChunksSchema } from "./chunksSchema"
import { Diff } from "@/components/diff"

export const DivideIntoChunks = ({setChunks}: {
        setChunks?: (chunks: string[] | undefined) => void
    }) =>
{
    const [document, setDocument] = useState(GLEANINGS_I)

    const { object, submit, isLoading } = useObject({
        schema: ChunksSchema,
        api: "/api/chunk/streaming",
        initialValue: {chunks: undefined},
    })

    const handleReset = useCallback(() => {
        setDocument(GLEANINGS_I)
    }, [])

    const chunks: string[] | undefined = useMemo(() => {
        // the strings can be undefined because of a use of DeepPartial<ChunkSchema> in the response
        const result = object?.chunks?.filter(Boolean)
        if (result?.length) return result as string[]
        else return undefined
    }, [object])

    useEffect(() => {
        if (!isLoading)
            setChunks?.(chunks)
    }, [chunks, isLoading, setChunks])

    return (
        <>
            <label htmlFor="document" className="text-2xl">
                <h2>Document to be chunked</h2>
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
            {chunks && (
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
            <Diff a={document} b={chunks?.join(" ") ?? ""} />
        </>
    )
}