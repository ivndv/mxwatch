import React from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";

// Overlay de carga inicial del mapa
export const CargandoMapaCompleto = () => {
	const locale = useLocale();
	return (
		<div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-40">
			<div className="flex flex-col items-center gap-4">
				<div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
				<span className="font-mono text-[11px] uppercase tracking-[0.18em] text-tertiary">
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
			<div className="bg-card/90 backdrop-blur-md border border-border-subtle rounded-full px-3 py-2 flex items-center gap-2 shadow-float">
				<div className="w-3 h-3 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
				<span className="font-mono text-[11px] text-tertiary">
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
		<div className="flex flex-col items-center gap-4 text-tertiary">
			<div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
			<span className="font-mono text-[11px] uppercase tracking-[0.18em]">
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
			<div className="bg-accent/10 border border-accent/20 rounded-xl px-4 py-2 flex items-center gap-2 shadow-float backdrop-blur-md">
				<span className="text-secondary text-[11px] font-mono">
					⚠️ {message}
				</span>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="text-[11px] font-medium text-accent hover:text-accent-hover ml-2 transition-colors"
				>
					{m.loading_retry({}, { locale })}
				</button>
			</div>
		</div>
	);
};
