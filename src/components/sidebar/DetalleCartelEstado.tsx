import { motion } from "framer-motion";
import React from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import type { InteligenciaEstado } from "@/schemas/api";

// Detalle expandido de un cártel dentro del panel de estado seleccionado
const DetalleCartelEstado = React.memo(
	({
		cartel,
		index,
	}: {
		cartel: InteligenciaEstado["carteles"][number];
		index: number;
	}) => {
		const locale = useLocale();
		return (
			<motion.div
				initial={{ opacity: 0, x: -5 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: index * 0.05 }}
				className={`flex flex-col gap-3 ${index > 0 ? "pt-6 border-t border-border relative" : ""}`}
			>
				{/* Separador entre cárteles si hay múltiples */}
				{index > 0 && (
					<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-[11px] text-tertiary uppercase font-bold">
						{m.panel_counterpart({}, { locale })}
					</div>
				)}

				{/* Nombre y color del cártel */}
				<div className="flex items-center gap-2">
					<div
						className="w-3 h-3 rounded-[3px]"
						style={{ backgroundColor: cartel.color }}
					/>
					<span className="text-sm font-medium" style={{ color: cartel.color }}>
						{cartel.nombre}
					</span>
				</div>

				<div className="flex flex-col gap-4">
					{/* Jefes máximos */}
					{cartel.jefes?.length > 0 && (
						<div className="flex flex-col gap-1">
							<h4 className="text-[11px] uppercase tracking-wide text-tertiary font-bold">
								{m.panel_bosses({}, { locale })}
							</h4>
							{cartel.jefes.map((j) => (
								<span
									key={j.nombre}
									className="text-xs text-primary font-semibold"
								>
									{j.nombre} {j.alias ? `("${j.alias}")` : ""}
								</span>
							))}
						</div>
					)}

					{/* Operadores regionales */}
					{cartel.personas?.length > 0 && (
						<div className="flex flex-col gap-1">
							<h4 className="text-[11px] uppercase tracking-wide text-tertiary font-bold">
								{m.panel_operators({}, { locale })}
							</h4>
							{cartel.personas.map((l) => (
								<span
									key={l.nombre}
									className="text-xs text-primary font-medium"
								>
									{l.nombre} {l.alias ? `("${l.alias}")` : ""}
								</span>
							))}
						</div>
					)}

					{/* Facciones operativas */}
					{cartel.facciones?.length > 0 && (
						<div className="flex flex-col gap-2 p-3 rounded-lg bg-elevated border border-border">
							<h4 className="text-[11px] uppercase tracking-wide text-tertiary font-bold">
								{m.panel_factions({}, { locale })}
							</h4>
							{cartel.facciones.map((f) => (
								<div
									key={f.nombre}
									className="flex flex-wrap items-center gap-2"
								>
									<div className="w-1 h-1 rounded-full bg-accent" />
									<span className="text-xs font-bold text-primary">
										{f.nombre}
									</span>
								</div>
							))}
						</div>
					)}

					{/* Brazos armados */}
					{cartel.brazos_armados?.length > 0 && (
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
			</motion.div>
		);
	},
);
DetalleCartelEstado.displayName = "DetalleCartelEstado";

export default DetalleCartelEstado;
