import { defineConfig } from "@inlang/paraglide-js";

export default defineConfig({
	outdir: "./src/paraglide",
	// URL primero: inglés sin prefijo, español bajo /es
	strategy: ["url", "cookie", "baseLocale"],
	urlPatterns: [
		{
			pattern: "/",
			localized: [
				["es", "/es"],
				["en", "/"],
			],
		},
		{
			pattern: "/map",
			localized: [
				["es", "/es/mapa"],
				["en", "/map"],
			],
		},
		{
			pattern: "/legal/terms",
			localized: [
				["es", "/es/legal/terminos"],
				["en", "/legal/terms"],
			],
		},
		{
			pattern: "/legal/privacy",
			localized: [
				["es", "/es/legal/privacidad"],
				["en", "/legal/privacy"],
			],
		},
		// Wildcard al final: el prefijo español debe evaluarse antes que el inglés
		{
			pattern: "/:path(.*)?",
			localized: [
				["es", "/es/:path(.*)?"],
				["en", "/:path(.*)?"],
			],
		},
	],
});
