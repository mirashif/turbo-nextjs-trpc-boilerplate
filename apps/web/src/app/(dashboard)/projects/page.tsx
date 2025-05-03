import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { getQueryClient, trpc } from "#/server/trpc/server"
import { Projects } from "./projects"

export default function ProjectsPage() {
	const queryClient = getQueryClient()
	queryClient.prefetchQuery(trpc.projects.queryOptions())

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ErrorBoundary fallback={"Error"}>
				<Suspense fallback={"Loading..."}>
					<Projects />
				</Suspense>
			</ErrorBoundary>
		</HydrationBoundary>
	)
}
