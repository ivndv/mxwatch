import React from "react";

const MAX_ZOOM = 8;
const DEFAULT_ZOOM = 1;

// Controles de zoom y reset del mapa
const MapaControles = React.memo(
	({
		onZoomIn,
		onZoomOut,
		onReset,
		zoom,
	}: {
		onZoomIn: () => void;
		onZoomOut: () => void;
		onReset: () => void;
		zoom: number;
	}) => (
		<div className="absolute top-20 md:bottom-6 right-3 md:right-6 flex flex-col gap-2 z-20">
			<button
				type="button"
				onClick={onZoomIn}
				disabled={zoom >= MAX_ZOOM}
				className="w-11 h-11 rounded-lg bg-card/80 border border-white/10 hover:bg-hover transition-all disabled:opacity-30 flex items-center justify-center text-lg"
				aria-label="Acercar"
			>
				+
			</button>
			<button
				type="button"
				onClick={onZoomOut}
				disabled={zoom <= DEFAULT_ZOOM}
				className="w-11 h-11 rounded-lg bg-card/80 border border-white/10 hover:bg-hover transition-all disabled:opacity-30 flex items-center justify-center text-lg"
				aria-label="Alejar"
			>
				-
			</button>
			<button
				type="button"
				onClick={onReset}
				className="w-11 h-11 rounded-lg bg-card/80 border border-white/10 text-accent hover:bg-accent/10 transition-all flex items-center justify-center"
				aria-label="Resetear"
			>
				⟲
			</button>
		</div>
	),
);

MapaControles.displayName = "MapaControles";
export default MapaControles;

// Indicador de atajos de teclado
export const IndicadorAtajos = () => (
	<div className="absolute bottom-6 left-6 z-30 bg-card/60 backdrop-blur-sm border border-white/5 rounded-lg px-3 py-2 text-[10px] font-mono text-tertiary hidden md:block">
		<div className="flex items-center gap-3">
			<span>+ / - : Zoom</span>
			<span>R : Reset</span>
			<span>ESC : Limpiar</span>
		</div>
	</div>
);
