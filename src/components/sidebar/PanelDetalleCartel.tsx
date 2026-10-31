import React from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import type { DetalleCartel } from "@/schemas/api";

// Panel con información detallada de un cártel seleccionado
const PanelDetalleCartel = React.memo(
	({ cartel, onClear }: { cartel: DetalleCartel; onClear: () => void }) => {
		const locale = useLocale();
		return (
			<div
				className="rounded-lg border p-4 flex flex-col gap-3 transition-all"
				style={{
					borderColor: `${cartel.color}40`,
					backgroundColor: `${cartel.color}10`,
				}}
			>
				{/* Encabezado con botón de cerrar */}
				<div className="flex items-center justify-between">
					<span className="text-[11px] font-bold uppercase tracking-wide text-tertiary">
						{m.panel_cartel_selected({}, { locale })}
					</span>
					<button
						type="button"
						onClick={onClear}
						className="text-tertiary hover:text-primary text-xs"
						aria-label={m.panel_cartel_close({}, { locale })}
					>
						✕
					</button>
				</div>

				{/* Nombre del cártel */}
				<div className="flex items-center gap-2">
					<div
						className="w-3 h-3 rounded-[3px]"
						style={{ backgroundColor: cartel.color }}
					/>
					<h3 className="text-base font-bold" style={{ color: cartel.color }}>
						{cartel.nombre}
					</h3>
				</div>

				<div className="flex flex-col gap-4">
					{/* Presencia por estados */}
					<div className="flex flex-col gap-1">
						<span className="text-[11px] uppercase tracking-wide text-tertiary font-bold">
							{m.panel_presence(
								{ count: cartel.presencia.total_estados },
								{ locale },
							)}
						</span>
						<div className="flex flex-wrap gap-1">
							{cartel.presencia.estados.map((e) => (
								<span
									key={e.nombre_estado}
									className="text-[11px] bg-elevated border border-border rounded px-1.5 py-0.5 text-secondary"
								>
									{e.nombre_estado}
								</span>
							))}
						</div>
					</div>

					{/* Cadena de mando */}
					{cartel.personas && cartel.personas.length > 0 && (
						<div className="flex flex-col gap-1">
							<h4 className="text-[11px] uppercase tracking-wide text-tertiary font-bold">
								{m.panel_chain({}, { locale })}
							</h4>
							{cartel.personas.map((p) => (
								<span
									key={p.nombre}
									className="text-xs text-primary font-medium"
								>
									{p.nombre} {p.alias ? `("${p.alias}")` : ""}
								</span>
							))}
						</div>
					)}

					{/* Facciones operativas */}
					{cartel.facciones && cartel.facciones.length > 0 && (
						<div className="flex flex-col gap-2 p-3 rounded-lg bg-elevated border border-border">
							<h4 className="text-[11px] uppercase tracking-wide text-tertiary font-bold">
								{m.panel_factions({}, { locale })}
							</h4>
							{cartel.facciones.map((f) => (
								<div key={f.nombre} className="flex flex-col gap-0.5">
									<div className="flex items-center gap-2">
										<div className="w-1 h-1 rounded-full bg-accent" />
										<span className="text-xs font-bold text-primary">
											{f.nombre}
										</span>
									</div>
									{f.enfoque && (
										<span className="text-[11px] text-tertiary ml-3">
											{f.enfoque}
										</span>
									)}
								</div>
							))}
						</div>
					)}

					{/* Brazos armados */}
					{cartel.brazos_armados && cartel.brazos_armados.length > 0 && (
						<div className="flex flex-col gap-2 p-3 rounded-lg bg-elevated border border-border">
							<h4 className="text-[11px] uppercase tracking-wide text-tertiary font-bold">
								{m.panel_armed({}, { locale })}
							</h4>
							{cartel.brazos_armados.map((b) => (
								<div key={b.nombre} className="flex items-center gap-2">
									<div className="w-1 h-1 rounded-full bg-red-400" />
									<span className="text-xs font-bold text-primary">
										{b.nombre}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		);
	},
);
PanelDetalleCartel.displayName = "PanelDetalleCartel";

export default PanelDetalleCartel;
