/** biome-ignore-all lint/suspicious/useAwait: <explanation> */
import { db } from "@repo/db/client"
import { initTRPC } from "@trpc/server"
import { cache } from "react"
import superjson from "superjson"

export const createTRPCContext = cache(async () => {
	return { db }
})
export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<TRPCContext>().create({
	transformer: superjson,
	sse: {
		maxDurationMs: 5 * 60 * 1_000, // 5 minutes
		ping: {
			enabled: true,
			intervalMs: 3_000,
		},
		client: {
			reconnectAfterInactivityMs: 5_000,
		},
	},
})

export const publicProcedure = t.procedure
export const router = t.router
export const mergeRouters = t.mergeRouters
export const trpcRouter = t.router
export const createCallerFactory = t.createCallerFactory
