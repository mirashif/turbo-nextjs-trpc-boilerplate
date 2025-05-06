import {createCallerFactory, createTRPCContext, publicProcedure, router} from "#/trpc/init"

export const appRouter = router({
	healthcheck: publicProcedure.query(() => "ok"),
	hello: publicProcedure.query(async () => {
		await new Promise(resolve => setTimeout(resolve, 1000))
		return {
			message: "hello",
		}
	}),

	projects: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.query.projects.findMany({
			with: {user: {columns: {id: true, email: true}}},
		});
	}),
})

export const caller = createCallerFactory(appRouter)(createTRPCContext)

export type AppRouter = typeof appRouter
