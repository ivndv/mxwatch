// SEO
import type { Metadata } from "next";
// Isla del mapa
import MapView from "@/components/mapa/MapView";
import * as m from "@/paraglide/messages";
import { isLocale } from "@/paraglide/runtime";

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
 * El shell se prerenderiza y la isla (MapView) se monta en el cliente.
 */
export default function MapaPage() {
	return <MapView />;
}
