import { db } from "@repo/db/client";
import { createCallerFactory, publicProcedure, router } from "../trpc/init";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "ok"),
  hello: publicProcedure.query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      message: "hello",
    };
  }),

  projects: publicProcedure.query(async () => {
    const projects = await db.query.projects.findMany({
      with: { users: true },
    });
    return projects;
  }),
});

export const caller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
