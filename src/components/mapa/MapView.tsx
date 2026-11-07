"use client";

import { Suspense, useEffect, useState } from "react";
import MapCanvas from "@/components/mapa";
import MobileSearch from "@/components/mapa/MobileSearch";
import MapSidebar from "@/components/sidebar/index";

// Alto disponible bajo el header fijo (incluye el safe area del notch)
const ALTO_MAPA =
	"h-[calc(100dvh-64px-env(safe-area-inset-top))] w-full overflow-hidden bg-surface";

// Isla cliente: el shell se prerenderiza y el mapa se monta tras la hidratación
export default function MapView() {
	const [montado, setMontado] = useState(false);

	useEffect(() => {
		setMontado(true);
	}, []);

	if (!montado) {
		return (
			<div className={`flex flex-col md:flex-row ${ALTO_MAPA}`}>
				<div className="hidden md:block w-full md:w-[360px] md:h-full bg-surface shrink-0" />
				<div className="flex-1 bg-surface-alt" />
			</div>
		);
	}

	return (
		<div className={`flex flex-col md:flex-row ${ALTO_MAPA}`}>
			<MobileSearch />

			{/* Sidebar lazy; en móvil es un sheet fijo sobre el mapa */}
			<Suspense
				fallback={
					<div className="hidden md:block w-full md:w-[360px] bg-surface shrink-0" />
				}
			>
				<MapSidebar />
			</Suspense>

			<MapCanvas />
		</div>
	);
}
