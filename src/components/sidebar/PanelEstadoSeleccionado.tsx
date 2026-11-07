import React, { useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import type { InteligenciaEstado } from "@/schemas/api";
import DetalleCartelEstado from "./DetalleCartelEstado";

interface Props {
	selectedState: string;
	stateIntelligence: InteligenciaEstado;
	primaryColor: string | null;
	onClear: () => void;
	onSelectCartel: (slug: string) => void;
}

// Panel de inteligencia del estado seleccionado en el mapa
const PanelEstadoSeleccionado = React.memo(
	({
		selectedState,
		stateIntelligence,
		primaryColor,
		onClear,
		onSelectCartel,
	}: Props) => {
		const locale = useLocale();
		const [expandido, setExpandido] = useState<string | null>(
			stateIntelligence.carteles[0]?.id ?? null,
		);

		// Al cambiar de estado, expande el primer cártel
		useEffect(() => {
			setExpandido(stateIntelligence.carteles[0]?.id ?? null);
		}, [stateIntelligence]);

		return (
			<div className="flex flex-col gap-4">
				{/* Encabezado con botón de cerrar */}
				<div className="flex items-center justify-between">
					<span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
						{m.panel_state_selected({}, { locale })}
					</span>
					<button
						type="button"
						onClick={onClear}
						className="text-tertiary hover:text-primary text-sm min-w-11 min-h-11 flex items-center justify-center -mr-2 transition-colors"
						aria-label={m.panel_state_close({}, { locale })}
					>
						✕
					</button>
				</div>

				<div className="flex items-baseline justify-between gap-2">
					<div className="flex items-center gap-2.5 min-w-0">
						{primaryColor && (
							<span
								aria-hidden="true"
								className="w-2.5 h-2.5 rounded-full shrink-0"
								style={{ backgroundColor: primaryColor }}
							/>
						)}
						<h3 className="text-lg font-semibold tracking-tight text-primary truncate">
							{selectedState}
						</h3>
					</div>
					<span className="font-mono text-[11px] text-tertiary whitespace-nowrap tabular-nums">
						{m.panel_state_total(
							{ count: stateIntelligence.total_carteles },
							{ locale },
						)}
					</span>
				</div>

				{/* Indicador de zona en disputa */}
				{stateIntelligence.carteles.length > 1 && (
					<div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1">
						<span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
						<span className="text-[11px] font-medium text-amber-400">
							{m.panel_disputed({}, { locale })}
						</span>
					</div>
				)}

				{/* Cárteles como acordeón */}
				<div className="flex flex-col border-t border-border-subtle">
					{stateIntelligence.carteles.map((cartelInfo) => {
						const abierto = expandido === cartelInfo.id;
						const panelId = `cartel-${cartelInfo.id}`;

						return (
							<div
								key={cartelInfo.id}
								className="border-b border-border-subtle last:border-b-0"
							>
								<button
									type="button"
									onClick={() => setExpandido(abierto ? null : cartelInfo.id)}
									aria-expanded={abierto}
									aria-controls={panelId}
									className="w-full flex items-center gap-3 py-3 min-h-11 text-left"
								>
									<span
										className="w-2.5 h-2.5 rounded-full shrink-0"
										style={{ backgroundColor: cartelInfo.color }}
									/>
									<span className="flex-1 text-sm font-medium truncate text-primary">
										{cartelInfo.nombre}
									</span>
									<span className="font-mono text-[11px] text-tertiary whitespace-nowrap tabular-nums">
										{m.panel_summary(
											{
												jefes: cartelInfo.jefes.length,
												operadores: cartelInfo.personas.length,
											},
											{ locale },
										)}
									</span>
									<span
										className={`text-tertiary text-xs transition-transform ${abierto ? "rotate-180" : ""}`}
										aria-hidden="true"
									>
										▾
									</span>
								</button>

								{abierto && (
									<div id={panelId} className="pb-4 pl-5">
										<DetalleCartelEstado cartel={cartelInfo} index={0} />
										<button
											type="button"
											onClick={() => onSelectCartel(cartelInfo.slug)}
											className="mt-3 min-h-11 text-[13px] font-medium text-accent hover:text-accent-hover transition-colors"
										>
											{m.panel_view_cartel({}, { locale })} →
										</button>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		);
	},
);

PanelEstadoSeleccionado.displayName = "PanelEstadoSeleccionado";

export default PanelEstadoSeleccionado;
