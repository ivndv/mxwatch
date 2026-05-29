import React from "react";
import type { DetalleCartel } from "@/schemas/api.schemas";

const DetalleCartelPanel = React.memo(
	({ cartel, onClear }: { cartel: DetalleCartel; onClear: () => void }) => (
		<div
			className="rounded-xl border p-4 flex flex-col gap-3 transition-all"
			style={{
				borderColor: `${cartel.color}40`,
				backgroundColor: `${cartel.color}10`,
			}}
		>
			<div className="flex items-center justify-between">
				<span className="text-[10px] font-black uppercase tracking-widest text-tertiary">
					Cártel seleccionado
				</span>
				<button
					type="button"
					onClick={onClear}
					className="text-tertiary hover:text-primary text-xs"
					aria-label="Cerrar panel del cártel"
				>
					✕
				</button>
			</div>

			<div className="flex items-center gap-2">
				<div
					className="w-3 h-3 rounded-sm"
					style={{ backgroundColor: cartel.color }}
				/>
				<h3 className="text-base font-bold" style={{ color: cartel.color }}>
					{cartel.nombre}
				</h3>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<span className="text-[9px] uppercase tracking-widest text-tertiary font-bold">
						Presencia: {cartel.presencia.total_estados} estados
					</span>
					<div className="flex flex-wrap gap-1">
						{cartel.presencia.estados.map((e) => (
							<span
								key={e.nombre_estado}
								className="text-[10px] bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-secondary"
							>
								{e.nombre_estado}
							</span>
						))}
					</div>
				</div>

				{cartel.personas && cartel.personas.length > 0 && (
					<div className="flex flex-col gap-1">
						<h4 className="text-[9px] uppercase tracking-widest text-tertiary font-bold">
							Cadena de Mando
						</h4>
						{cartel.personas.map((p) => (
							<span key={p.nombre} className="text-xs text-primary font-medium">
								{p.nombre} {p.alias ? `("${p.alias}")` : ""}
							</span>
						))}
					</div>
				)}

				{cartel.facciones && cartel.facciones.length > 0 && (
					<div className="flex flex-col gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
						<h4 className="text-[9px] uppercase tracking-widest text-tertiary font-bold">
							Facciones Operativas
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
									<span className="text-[10px] text-tertiary ml-3">
										{f.enfoque}
									</span>
								)}
							</div>
						))}
					</div>
				)}

				{cartel.brazos_armados && cartel.brazos_armados.length > 0 && (
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
		</div>
	),
);
DetalleCartelPanel.displayName = "DetalleCartelPanel";

export default DetalleCartelPanel;
