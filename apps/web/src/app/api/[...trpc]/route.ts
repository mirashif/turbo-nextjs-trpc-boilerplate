import logger from "@repo/logger"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "#/server/routers/_app"
import { createTRPCContext } from "#/trpc/init"

const log = logger.createLogger({
	level: "error",
})

const handler = (req: Request) => {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: createTRPCContext,
		onError({ error }) {
			if (error.code === "INTERNAL_SERVER_ERROR") {
				log.error(error)
			}
		},
	})
}

export { handler as GET, handler as POST }
