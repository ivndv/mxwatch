import { motion } from "framer-motion";
import React from "react";
import type { InteligenciaEstado } from "@/schemas/api.schemas";

// Detalle expandido de un cártel dentro del panel de estado seleccionado
const DetalleCartelEstado = React.memo(
	({
		cartel,
		index,
	}: {
		cartel: InteligenciaEstado["carteles"][number];
		index: number;
	}) => (
		<motion.div
			initial={{ opacity: 0, x: -5 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.05 }}
			className={`flex flex-col gap-3 ${index > 0 ? "pt-6 border-t border-white/10 relative" : ""}`}
		>
			{/* Separador entre cárteles si hay múltiples */}
			{index > 0 && (
				<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-[8px] text-tertiary uppercase font-bold">
					Resistencia / Contraparte
				</div>
			)}

			{/* Nombre y color del cártel */}
			<div className="flex items-center gap-2">
				<div
					className="w-3 h-3 rounded-sm"
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
						<h4 className="text-[9px] uppercase tracking-widest text-tertiary font-bold">
							Jefes Máximos
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
						<h4 className="text-[9px] uppercase tracking-widest text-tertiary font-bold">
							Operadores Regionales
						</h4>
						{cartel.personas.map((l) => (
							<span key={l.nombre} className="text-xs text-primary font-medium">
								{l.nombre} {l.alias ? `("${l.alias}")` : ""}
							</span>
						))}
					</div>
				)}

				{/* Facciones operativas */}
				{cartel.facciones?.length > 0 && (
					<div className="flex flex-col gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
						<h4 className="text-[9px] uppercase tracking-widest text-tertiary font-bold">
							Facciones Operativas
						</h4>
						{cartel.facciones.map((f) => (
							<div key={f.nombre} className="flex flex-wrap items-center gap-2">
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
					<div className="flex flex-col gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
						<h4 className="text-[9px] uppercase tracking-widest text-tertiary font-bold">
							Brazos Armados
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
	),
);
DetalleCartelEstado.displayName = "DetalleCartelEstado";

export default DetalleCartelEstado;
