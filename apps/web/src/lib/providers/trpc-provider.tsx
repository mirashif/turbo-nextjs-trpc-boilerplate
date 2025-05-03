"use client"

import type { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import { createTRPCClient, httpBatchStreamLink, httpSubscriptionLink, loggerLink, splitLink } from "@trpc/client"
import { createTRPCContext } from "@trpc/tanstack-react-query"
import { useState } from "react"
import superjson from "superjson"
import { makeQueryClient } from "#/lib/query-client"
import type { AppRouter } from "#/server/routers/_app"

let clientQueryClientSingleton: QueryClient
export const { TRPCProvider: BaseTRPCProvider, useTRPC } = createTRPCContext<AppRouter>()

function getQueryClient() {
	if (typeof window === "undefined") {
		// Server: always make a new query client
		return makeQueryClient()
	}
	// Browser: use singleton pattern to keep the same query client
	// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
	return (clientQueryClientSingleton ??= makeQueryClient())
}
function getUrl() {
	const base = (() => {
		if (typeof window !== "undefined") return ""
		if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
		return `http://localhost:${process.env.PORT ?? 3000}`
	})()
	return `${base}/api/trpc`
}
export function TRPCProvider(
	props: Readonly<{
		children: React.ReactNode
	}>,
) {
	// NOTE: Avoid useState when initializing the query client if you don't
	//       have a suspense boundary between this and the code that may
	//       suspend because React will throw away the client on the initial
	//       render if it suspends and there is no boundary
	const [queryClient] = useState(() => getQueryClient())
	const [trpcClient] = useState(() =>
		createTRPCClient<AppRouter>({
			links: [
				// adds pretty logs to your console in development and logs errors in production
				loggerLink(),
				splitLink({
					condition: op => op.type === "subscription",
					true: httpSubscriptionLink({
						url: getUrl(),
						/**
						 * @see https://trpc.io/docs/v11/data-transformers
						 */
						transformer: superjson,
					}),
					false: httpBatchStreamLink({
						url: getUrl(),
						headers: () => {
							const newHeaders = new Headers()
							newHeaders.set("x-trpc-source", "nextjs-react")
							return Object.fromEntries(newHeaders)
						},
						/**
						 * @see https://trpc.io/docs/v11/data-transformers
						 */
						transformer: superjson,
					}),
				}),
			],
		}),
	)
	return (
		<QueryClientProvider client={queryClient}>
			<BaseTRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{props.children}
			</BaseTRPCProvider>
		</QueryClientProvider>
	)
}
