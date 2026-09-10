import type React from "react";

// Estado del tooltip al hacer hover sobre un estado
export interface TooltipState {
	content: string;
	cartel: string;
	color: string;
	x: number;
	y: number;
}

// Estilo visual de cada estado en el mapa
export interface CartelStyle {
	fill: string;
	stroke: string;
	strokeWidth: number;
	cartel: string;
	opacity: number;
	liveDataRaw: { color?: string } | null;
}

// Patrón SVG para estados con múltiples cárteles
export interface PatronDef {
	id: string;
	colores: string[];
}

// Props del componente MapaRenderizado
export interface MapaMemoizadoProps {
	features: unknown[];
	position: { coordinates: [number, number]; zoom: number };
	handleMoveEnd: (position: {
		coordinates: [number, number];
		zoom: number;
	}) => void;
	getCartelStyle: (nombreEstado: string) => CartelStyle;
	selectedState: string | null;
	setSelectedState: (state: string | null) => void;
	setTooltip: React.Dispatch<React.SetStateAction<TooltipState | null>>;
	mapScale: number;
	containerRef: React.RefObject<HTMLDivElement | null>;
	patronesDefs: PatronDef[];
}
