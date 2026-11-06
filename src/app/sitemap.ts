import type { MetadataRoute } from "next";

/**
 * Sitemap con las rutas en ambos idiomas y sus alternates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://mxwatch.liuma.app";

	// Par de rutas equivalentes por idioma
	const rutas = [
		{ en: "/", es: "/es", priority: 1 },
		{ en: "/map", es: "/es/mapa", priority: 0.8 },
		{ en: "/legal/terms", es: "/es/legal/terminos", priority: 0.3 },
		{ en: "/legal/privacy", es: "/es/legal/privacidad", priority: 0.3 },
	];

	return rutas.flatMap(({ en, es, priority }) => {
		const languages = { en: `${baseUrl}${en}`, es: `${baseUrl}${es}` };
		return [
			{
				url: `${baseUrl}${en}`,
				lastModified: new Date(),
				changeFrequency: "daily" as const,
				priority,
				alternates: { languages },
			},
			{
				url: `${baseUrl}${es}`,
				lastModified: new Date(),
				changeFrequency: "daily" as const,
				priority,
				alternates: { languages },
			},
		];
	});
}
