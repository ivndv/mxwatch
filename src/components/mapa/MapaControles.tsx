import React from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";

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
	}) => {
		const locale = useLocale();
		return (
			<div className="absolute top-20 md:bottom-6 right-3 md:right-6 flex flex-col gap-2 z-20">
				<button
					type="button"
					onClick={onZoomIn}
					disabled={zoom >= MAX_ZOOM}
					className="w-9 h-9 rounded-md bg-card border border-border hover:bg-hover transition-all disabled:opacity-30 flex items-center justify-center text-base"
					aria-label={m.map_zoom_in({}, { locale })}
				>
					+
				</button>
				<button
					type="button"
					onClick={onZoomOut}
					disabled={zoom <= DEFAULT_ZOOM}
					className="w-9 h-9 rounded-md bg-card border border-border hover:bg-hover transition-all disabled:opacity-30 flex items-center justify-center text-base"
					aria-label={m.map_zoom_out({}, { locale })}
				>
					-
				</button>
				<button
					type="button"
					onClick={onReset}
					className="w-9 h-9 rounded-md bg-card border border-border text-accent hover:bg-accent/10 transition-all flex items-center justify-center"
					aria-label={m.map_reset({}, { locale })}
				>
					⟲
				</button>
			</div>
		);
	},
);

MapaControles.displayName = "MapaControles";
export default MapaControles;

// Indicador de atajos de teclado
export const IndicadorAtajos = () => {
	const locale = useLocale();
	return (
		<div className="absolute bottom-6 left-6 z-30 bg-card border border-border-subtle rounded-md px-3 py-2 text-[11px] font-mono text-tertiary hidden md:block">
			<div className="flex items-center gap-3">
				<span>{m.map_shortcut_zoom({}, { locale })}</span>
				<span>{m.map_shortcut_reset({}, { locale })}</span>
				<span>{m.map_shortcut_clear({}, { locale })}</span>
			</div>
		</div>
	);
};
