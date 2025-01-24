import { useCallback, useState } from "react"
import { submitChunks } from "./submitChunksAction"

// submit chunks, along with a document title, via a server action
export const SubmitChunks = ({chunks}: {chunks: string[]}) => {
    const [title, setTitle] = useState("")
    const handleSubmit = useCallback(async () => {
        if (title && chunks.length) {
            const response = await submitChunks(title, "https://example.com", chunks)
            console.log({result: response})
        }
    }, [])
    return (
        <form className="space-y-4" onSubmit={
            e => {
                e.preventDefault()
                handleSubmit()
            }
        }>
            <h2 className="text-2xl text-center">Save Chunks</h2>
            <div className="space-x-4">
                <input
                    type="text"
                    placeholder="Document title"
                    className="input"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={!title || !chunks.length}
                >
                    Save
                </button>
            </div>
        </form>
    )
}