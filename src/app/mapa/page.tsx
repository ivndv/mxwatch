// SEO
import type { Metadata } from "next";

// React
import { Suspense } from "react";

// Componentes del mapa
import MapCanvas from "@/components/mapa";
import MapSidebar from "@/components/sidebar/index";

export const metadata: Metadata = {
	title: "Mapa interactivo — mxwatch",
	description:
		"Visualiza el control territorial de los cárteles en cada estado de México. Datos de inteligencia actualizados a Mayo 2026.",
	openGraph: {
		title: "Mapa interactivo — mxwatch",
		description:
			"Visualiza el control territorial de los cárteles en cada estado de México.",
	},
};

export const dynamic = "force-dynamic";

/**
 * Vista principal del mapa interactivo.
 * Compone el lienzo geográfico (MapCanvas) y el panel de inteligencia (MapSidebar).
 */
export default function MapaPage() {
	return (
		<div className="flex flex-col md:flex-row h-[calc(100dvh-64px)] w-full overflow-hidden bg-surface">
			{/* Sidebar lazy con skeleton en mobile */}
			<Suspense
				fallback={<div className="w-full md:w-[380px] bg-card shrink-0" />}
			>
				<MapSidebar />
			</Suspense>

			<MapCanvas />
		</div>
	);
}
