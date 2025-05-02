import "./globals.css"
import "@repo/ui/globals.css"
import { Toaster } from "@repo/ui/components/sonner"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"

import { TRPCProvider } from "../lib/providers/trpc-provider"

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
	title: "TRPC Boilerplate",
	description: "A boilerplate for TRPC with Next.js app router",
	icons: `${process.env.NEXT_SERVER_URL}/favicon-32x32.png`,
}

// biome-ignore lint/suspicious/useAwait: RSC
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="dark">
			<TRPCProvider>
				<body className={`${nunito.className} antialiased min-h-dvh text-foreground`}>
					<Toaster />
					<main>{children}</main>
				</body>
			</TRPCProvider>
		</html>
	)
}
