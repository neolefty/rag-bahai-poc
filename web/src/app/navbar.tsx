"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"

const routes = {
    "/": "Home",
    "/chunk": "Chunk Documents",
    "/load": "Load Documents",
}

// Warning: This polls window.location every 50ms
//  Get the current top-level route from window.location
const useRoute = () => {
    const [route, setRoute] = useState("/")
    const routeRef = useRef("/")
    // extract route from window location
    const updateRoute = useCallback(() => {
        // if we want a multi-level path instead, get everything from the first slash to # or ?.
        const newRoute = "/" + window.location.pathname.split("/")[1]
        if (routeRef.current !== newRoute) {
            routeRef.current = newRoute
            setRoute(newRoute)
        }
    }, [])
    useEffect(() => {
        if (typeof window !== "undefined") {
            // polling can't be helped: https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
            const cleanup = setInterval(updateRoute, 50)
            return () =>
                clearInterval(cleanup)
        }
    }, [])
    useEffect(updateRoute, [])
    return route
}

export const Navbar = () => {
    const route = useRoute()
    return (
        <div className="flex space-x-4 w-full justify-center bg-gray-200 dark:bg-gray-800 p-2">
            {Object.entries(routes).map(([path, name]) => (
                <Link
                    key={path}
                    href={path}
                    className={`text-lg font-medium ${route === path ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-400"}`}
                >
                    {name}
                </Link>
            ))}
        </div>
    )
}