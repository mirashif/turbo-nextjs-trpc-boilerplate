import { db } from "@repo/db/client"
import { cache } from "react"
export const createContext = cache(() => {
	return { db }
})

export type Context = Awaited<ReturnType<typeof createContext>>
