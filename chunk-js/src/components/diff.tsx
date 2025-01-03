import { diffWords } from "diff"

export const Diff = ({a, b}: { a: string, b: string }) => {
    const changes = diffWords(a, b)
    return (
        <div className="w-[80vw] sm:max-w-[40rem]">
            <h2 className="text-xl">Changes:</h2>
            <ul>
                {changes.map((change, i) => (
                    <li key={i}
                        className={change.added ? "text-green-600" : change.removed ? "text-red-600" : "text-gray-400"}>
                        {change.value}
                    </li>
                ))}
            </ul>
        </div>
    )
}