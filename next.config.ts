import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},
};

export default nextConfig;

if (process.env.NODE_ENV === "development") {
	import("@opennextjs/cloudflare").then(({ initOpenNextCloudflareForDev }) =>
		initOpenNextCloudflareForDev(),
	);
}
