import "server-only" // <-- ensure this file cannot be imported from the client
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import { cache } from "react"
import { makeQueryClient } from "../../lib/query-client"
import { appRouter } from "../routers/_app"
import { createContext } from "./context"
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient)

export const trpc = createTRPCOptionsProxy({
	ctx: createContext,
	router: appRouter,
	queryClient: getQueryClient,
})
