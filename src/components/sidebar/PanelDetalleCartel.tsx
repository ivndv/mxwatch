import React, { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import type { DetalleCartel } from "@/schemas/api";

// Panel con información detallada de un cártel seleccionado
const PanelDetalleCartel = React.memo(
	({
		cartel,
		onClear,
		onSelectState,
	}: {
		cartel: DetalleCartel;
		onClear: () => void;
		onSelectState: (nombre: string) => void;
	}) => {
		const locale = useLocale();
		const [presenciaAbierta, setPresenciaAbierta] = useState(false);

		return (
			<div className="flex flex-col gap-4">
				{/* Encabezado con botón de cerrar */}
				<div className="flex items-center justify-between">
					<span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
						{m.panel_cartel_selected({}, { locale })}
					</span>
					<button
						type="button"
						onClick={onClear}
						className="text-tertiary hover:text-primary text-sm min-w-11 min-h-11 flex items-center justify-center -mr-2 transition-colors"
						aria-label={m.panel_cartel_close({}, { locale })}
					>
						✕
					</button>
				</div>

				{/* Nombre del cártel */}
				<div className="flex items-center gap-2.5">
					<span
						aria-hidden="true"
						className="w-2.5 h-2.5 rounded-full shrink-0"
						style={{ backgroundColor: cartel.color }}
					/>
					<h3 className="text-lg font-semibold tracking-tight text-primary">
						{cartel.nombre}
					</h3>
				</div>

				{/* Presencia por estados */}
				<div className="flex flex-col gap-2">
					<button
						type="button"
						onClick={() => setPresenciaAbierta((abierta) => !abierta)}
						aria-expanded={presenciaAbierta}
						className="flex items-center justify-between gap-2 min-h-11 text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary"
					>
						<span>
							{m.panel_presence(
								{ count: cartel.presencia.total_estados },
								{ locale },
							)}
						</span>
						<span
							className={`text-xs transition-transform ${presenciaAbierta ? "rotate-180" : ""}`}
							aria-hidden="true"
						>
							▾
						</span>
					</button>

					{presenciaAbierta && (
						<div className="flex flex-wrap gap-1.5">
							{cartel.presencia.estados.map((e) => (
								<button
									type="button"
									key={e.nombre_estado}
									onClick={() => onSelectState(e.nombre_estado)}
									className="text-[13px] rounded-lg border border-border-subtle bg-elevated px-3 min-h-11 text-secondary hover:bg-hover hover:border-border-strong hover:text-primary transition-colors"
								>
									{e.nombre_estado}
								</button>
							))}
						</div>
					)}
				</div>

				{/* Cadena de mando */}
				{cartel.personas && cartel.personas.length > 0 && (
					<div className="flex flex-col gap-2 pt-4 border-t border-border-subtle">
						<h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
							{m.panel_chain({}, { locale })}
						</h4>
						<div className="flex flex-col gap-1.5">
							{cartel.personas.map((p) => (
								<span
									key={p.nombre}
									className="text-[14px] text-secondary leading-snug"
								>
									{p.nombre} {p.alias ? `("${p.alias}")` : ""}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Facciones operativas */}
				{cartel.facciones && cartel.facciones.length > 0 && (
					<div className="flex flex-col gap-2 pt-4 border-t border-border-subtle">
						<h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
							{m.panel_factions({}, { locale })}
						</h4>
						<div className="flex flex-col gap-2">
							{cartel.facciones.map((f) => (
								<div key={f.nombre} className="flex flex-col gap-0.5">
									<div className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
										<span className="text-sm font-medium text-primary">
											{f.nombre}
										</span>
									</div>
									{f.enfoque && (
										<span className="text-[13px] text-tertiary ml-3.5 leading-snug">
											{f.enfoque}
										</span>
									)}
								</div>
							))}
						</div>
					</div>
				)}

				{/* Brazos armados */}
				{cartel.brazos_armados && cartel.brazos_armados.length > 0 && (
					<div className="flex flex-col gap-2 pt-4 border-t border-border-subtle">
						<h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
							{m.panel_armed({}, { locale })}
						</h4>
						<div className="flex flex-col gap-1.5">
							{cartel.brazos_armados.map((b) => (
								<div key={b.nombre} className="flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
									<span className="text-sm font-medium text-primary">
										{b.nombre}
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		);
	},
);

PanelDetalleCartel.displayName = "PanelDetalleCartel";

export default PanelDetalleCartel;
