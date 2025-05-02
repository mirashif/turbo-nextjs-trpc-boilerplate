import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { getQueryClient, trpc } from "../../server/trpc/server"
import { HomePage } from "./components/home"
export default function Home() {
	const queryClient = getQueryClient()
	queryClient.prefetchQuery(trpc.hello.queryOptions())

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ErrorBoundary fallback={"Error"}>
				<Suspense fallback={"Loading..."}>
					<HomePage />
				</Suspense>
			</ErrorBoundary>
		</HydrationBoundary>
	)
}
