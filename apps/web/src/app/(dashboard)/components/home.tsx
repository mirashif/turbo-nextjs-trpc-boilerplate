"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "#/trpc/client"

export function HomePage() {
	const trpc = useTRPC()
	const { data } = useSuspenseQuery(trpc.hello.queryOptions())
	return <div className="p-4">{JSON.stringify(data)}</div>
}
