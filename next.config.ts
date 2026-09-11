import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "mxwatch-assets.mgdc.site",
			},
		],
	},
};

export default nextConfig;

if (process.env.NODE_ENV === "development") {
	import("@opennextjs/cloudflare").then(({ initOpenNextCloudflareForDev }) =>
		initOpenNextCloudflareForDev(),
	);
}
