// SEO
import type { Metadata } from "next";
// React
import { Suspense } from "react";
// Componentes del mapa
import MapCanvas from "@/components/mapa";
import MapSidebar from "@/components/sidebar/index";
import * as m from "@/paraglide/messages";
import { isLocale } from "@/paraglide/runtime";

export const dynamic = "force-dynamic";

// Metadatos localizados de la vista del mapa
export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const l = isLocale(locale) ? locale : "en";
	return {
		title: m.map_title({}, { locale: l }),
		description: m.map_description({}, { locale: l }),
		openGraph: {
			title: m.map_title({}, { locale: l }),
			description: m.map_description({}, { locale: l }),
		},
	};
}

/**
 * Vista principal del mapa interactivo.
 * Compone el lienzo geográfico (MapCanvas) y el panel de inteligencia (MapSidebar).
 */
export default function MapaPage() {
	return (
		<div className="flex flex-col md:flex-row h-[calc(100dvh-64px)] w-full overflow-hidden bg-surface">
			{/* Sidebar lazy con skeleton en mobile */}
			<Suspense
				fallback={<div className="w-full md:w-[348px] bg-card shrink-0" />}
			>
				<MapSidebar />
			</Suspense>

			<MapCanvas />
		</div>
	);
}
