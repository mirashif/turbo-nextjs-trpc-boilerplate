import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import AppSidebar from "./components/dashboard-sidebar"
import Header from "./components/header"

export const metadata: Metadata = {
	title: "Next Shadcn Dashboard Starter",
	description: "Basic dashboard with Next.js and Shadcn",
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	// Persisting the sidebar state in the cookie.
	const cookieStore = await cookies()
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar />
			<SidebarInset>
				<Header />
				{/* page main content */}
				{children}
				{/* page main content ends */}
			</SidebarInset>
		</SidebarProvider>
	)
}
