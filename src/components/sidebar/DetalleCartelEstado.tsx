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
				className={`flex flex-col gap-3 ${index > 0 ? "pt-6 border-t border-border-subtle relative" : ""}`}
			>
				{/* Separador entre cárteles si hay múltiples */}
				{index > 0 && (
					<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-[11px] font-semibold text-tertiary uppercase tracking-[0.16em]">
						{m.panel_counterpart({}, { locale })}
					</div>
				)}

				{/* Nombre y color del cártel */}
				<div className="flex items-center gap-2">
					<span
						aria-hidden="true"
						className="w-2.5 h-2.5 rounded-full shrink-0"
						style={{ backgroundColor: cartel.color }}
					/>
					<span className="text-sm font-medium text-primary">
						{cartel.nombre}
					</span>
				</div>

				<div className="flex flex-col gap-4">
					{/* Jefes máximos */}
					{cartel.jefes?.length > 0 && (
						<div className="flex flex-col gap-1.5">
							<h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
								{m.panel_bosses({}, { locale })}
							</h4>
							{cartel.jefes.map((j) => (
								<span
									key={j.nombre}
									className="text-sm text-primary font-medium leading-snug"
								>
									{j.nombre} {j.alias ? `("${j.alias}")` : ""}
								</span>
							))}
						</div>
					)}

					{/* Operadores regionales */}
					{cartel.personas?.length > 0 && (
						<div className="flex flex-col gap-1.5">
							<h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
								{m.panel_operators({}, { locale })}
							</h4>
							{cartel.personas.map((l) => (
								<span
									key={l.nombre}
									className="text-sm text-secondary leading-snug"
								>
									{l.nombre} {l.alias ? `("${l.alias}")` : ""}
								</span>
							))}
						</div>
					)}

					{/* Facciones operativas */}
					{cartel.facciones?.length > 0 && (
						<div className="flex flex-col gap-2">
							<h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
								{m.panel_factions({}, { locale })}
							</h4>
							{cartel.facciones.map((f) => (
								<div key={f.nombre} className="flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
									<span className="text-sm font-medium text-primary">
										{f.nombre}
									</span>
								</div>
							))}
						</div>
					)}

					{/* Brazos armados */}
					{cartel.brazos_armados?.length > 0 && (
						<div className="flex flex-col gap-2">
							<h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
								{m.panel_armed({}, { locale })}
							</h4>
							{cartel.brazos_armados.map((b) => (
								<div key={b.nombre} className="flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
									<span className="text-sm font-medium text-primary">
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
