import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: true,
	transpilePackages: ["@repo/ui"],
	experimental: {
		reactCompiler: true,
	},
	webpack: config => {
		config.externals.push("pino-pretty", "lokijs", "encoding")
		return config
	},
	output: "standalone",
}

export default nextConfig
