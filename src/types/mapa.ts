import type { Feature, Geometry } from "geojson";
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

// Vista del mapa: traslación + escala del grupo SVG
export interface ViewTransform {
	x: number;
	y: number;
	k: number;
}

// Props de MapaRenderizado
export interface MapaMemoizadoProps {
	features: Feature<Geometry>[];
	view: ViewTransform;
	svgRef: (el: SVGSVGElement | null) => void;
	didDragRef: { current: boolean };
	onPointerDown: React.PointerEventHandler<SVGSVGElement>;
	getCartelStyle: (nombreEstado: string) => CartelStyle;
	selectedState: string | null;
	setSelectedState: (state: string | null) => void;
	setTooltip: React.Dispatch<React.SetStateAction<TooltipState | null>>;
	mapScale: number;
	containerRef: React.RefObject<HTMLDivElement | null>;
	patronesDefs: PatronDef[];
}
