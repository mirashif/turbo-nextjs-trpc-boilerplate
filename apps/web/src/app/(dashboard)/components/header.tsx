import { Separator } from "@repo/ui/components/separator"
import { SidebarTrigger } from "@repo/ui/components/sidebar"
import React from "react"
import { Breadcrumbs } from "./breadcrumbs"
// import { UserNav } from './user-nav';
// import { ThemeSelector } from '../theme-selector';
// import { ModeToggle } from './ThemeToggle/theme-toggle';
// import CtaGithub from './cta-github';

export default function Header() {
	return (
		<header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumbs />
			</div>

			<div className="flex items-center gap-2 px-4">
				Hello: World
				{/* <CtaGithub /> */}
				{/* <UserNav /> */}
				{/* <ModeToggle /> */}
				{/* <ThemeSelector /> */}
			</div>
		</header>
	)
}
