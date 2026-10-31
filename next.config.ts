import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},
	// El proxy lee la URL original sin normalizarla
	skipProxyUrlNormalize: true,
	// La antigua ruta española se conserva como redirect permanente
	async redirects() {
		return [
			{
				source: "/mapa",
				destination: "/es/mapa",
				permanent: true,
			},
		];
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "assets.mgdc.site",
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
