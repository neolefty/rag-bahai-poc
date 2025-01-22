"use client"

export default function Home() {
    return (
        <div className="flex flex-col items-center space-y-4 py-5">
            <h1 className="text-3xl">
                <a
                    target="_blank" href="https://en.wikipedia.org/wiki/Retrieval-augmented_generation"
                    className="text-blue-800 dark:text-blue-400"
                >
                    RAG
                </a> Proof of Concept
            </h1>
        </div>
    )
}
