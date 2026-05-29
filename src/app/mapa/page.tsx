import type { Metadata } from "next";
import { Suspense } from "react";
import MapCanvas from "@/components/MapCanvas";
import MapSidebar from "@/components/MapSidebar";

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
export const runtime = "edge";

/**
 * Vista principal del mapa interactivo.
 * Compone el lienzo geográfico (MapCanvas) y el panel de inteligencia (MapSidebar).
 */
export default function MapaPage() {
	return (
		<div className="flex flex-col md:flex-row h-[calc(100dvh-64px)] w-full overflow-hidden bg-surface">
			<Suspense
				fallback={<div className="w-full md:w-[380px] bg-card shrink-0" />}
			>
				<MapSidebar />
			</Suspense>

			<MapCanvas />
		</div>
	);
}
