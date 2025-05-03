"use client"

import type { Project, User } from "@repo/db"
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/table"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "#/lib/providers/trpc-provider"

/* TODO: need to check trpc setup. trpc inference isn't working.. :'( */
type ProjectsResult = Array<Omit<Project, "userId"> & { user: Pick<User, "id" | "email"> }>

export function Projects() {
	const trpc = useTRPC()
	const { data: projects } = useSuspenseQuery<ProjectsResult>(trpc.projects.queryOptions())

	return (
		<Table>
			<TableCaption>A list of projects</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Project ID</TableHead>
					<TableHead>Date & Time</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Owner Email</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{projects.map(project => (
					<TableRow key={project.id}>
						<TableCell>{project.id}</TableCell>
						<TableCell>{new Date(project.createdAt).toLocaleString()}</TableCell>
						<TableCell>{project.name}</TableCell>
						<TableCell>{project.user.email}</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={3}>Total Projects</TableCell>
					<TableCell>{projects.length}</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	)
}
