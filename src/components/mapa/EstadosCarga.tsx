import React from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";

// Overlay de carga inicial del mapa
export const CargandoMapaCompleto = () => {
	const locale = useLocale();
	return (
		<div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-40">
			<div className="flex flex-col items-center gap-4">
				<div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
				<span className="text-xs font-mono uppercase tracking-[0.2em] text-secondary">
					{m.loading_syncing({}, { locale })}
				</span>
			</div>
		</div>
	);
};

// Indicador pequeño de carga de datos en la esquina
export const IndicadorCargaDatos = () => {
	const locale = useLocale();
	return (
		<div className="absolute top-4 right-4 z-30">
			<div className="bg-card border border-border rounded-md px-3 py-2 flex items-center gap-2">
				<div className="w-3 h-3 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
				<span className="text-[11px] font-mono text-secondary">
					{m.loading_data({}, { locale })}
				</span>
			</div>
		</div>
	);
};

// Spinner central mientras se descarga la geometría
export const CargandoInicial = React.memo(() => {
	const locale = useLocale();
	return (
		<div className="flex flex-col items-center gap-4 text-secondary">
			<div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
			<span className="text-xs font-mono uppercase tracking-[0.2em]">
				{m.loading_map({}, { locale })}
			</span>
		</div>
	);
});

CargandoInicial.displayName = "CargandoInicial";

// Banner de error con botón para recargar
export const MensajeError = ({ message }: { message: string }) => {
	const locale = useLocale();
	return (
		<div
			role="alert"
			className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50"
		>
			<div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 flex items-center gap-2">
				<span className="text-red-400 text-xs font-mono">⚠️ {message}</span>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="text-xs text-red-400/70 hover:text-red-400 ml-2 underline"
				>
					{m.loading_retry({}, { locale })}
				</button>
			</div>
		</div>
	);
};
