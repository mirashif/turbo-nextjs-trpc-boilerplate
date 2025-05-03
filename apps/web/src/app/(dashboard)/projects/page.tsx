import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { HydrateClient, prefetch, trpc } from "#/trpc/server"
import { Projects } from "./projects"

// biome-ignore lint/suspicious/useAwait: <explanation>
export default async function ProjectsPage() {
	prefetch(trpc.projects.queryOptions())

	return (
		<HydrateClient>
			<ErrorBoundary fallback={"Error"}>
				<Suspense fallback={"Loading..."}>
					<Projects />
				</Suspense>
			</ErrorBoundary>
		</HydrateClient>
	)
}
