import { createContext } from "../trpc/context"
import { createCallerFactory, publicProcedure, router } from "../trpc/init"

export const appRouter = router({
	healthcheck: publicProcedure.query(() => "ok"),
	hello: publicProcedure.query(async () => {
		await new Promise(resolve => setTimeout(resolve, 1000))
		return {
			message: "hello",
		}
	}),

	projects: publicProcedure.query(async ({ ctx }) => {
		const projects = await ctx.db.query.projects.findMany({
			with: { user: { columns: { id: true, email: true } } },
		})
		return projects
	}),
})

export const caller = createCallerFactory(appRouter)(createContext)

export type AppRouter = typeof appRouter
