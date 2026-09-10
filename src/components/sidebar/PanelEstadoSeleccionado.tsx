import React from "react";
import type { InteligenciaEstado } from "@/schemas/api";
import DetalleCartelEstado from "./DetalleCartelEstado";

interface Props {
	selectedState: string;
	stateIntelligence: InteligenciaEstado;
	primaryColor: string | null;
	onClear: () => void;
}

// Panel de inteligencia del estado seleccionado en el mapa
const PanelEstadoSeleccionado = React.memo(
	({ selectedState, stateIntelligence, primaryColor, onClear }: Props) => (
		<div
			className="rounded-xl border p-4 flex flex-col gap-3 transition-all"
			style={{
				borderColor: primaryColor
					? `${primaryColor}40`
					: "rgba(255,255,255,0.1)",
				backgroundColor: primaryColor
					? `${primaryColor}10`
					: "rgba(255,255,255,0.03)",
			}}
		>
			{/* Encabezado con botón de cerrar */}
			<div className="flex items-center justify-between">
				<span className="text-[10px] font-black uppercase tracking-widest text-tertiary">
					Estado seleccionado
				</span>
				<button
					type="button"
					onClick={onClear}
					className="text-tertiary hover:text-primary text-xs"
					aria-label="Cerrar panel del estado"
				>
					✕
				</button>
			</div>
			<h3 className="text-base font-bold text-primary">{selectedState}</h3>

			<div className="flex flex-col gap-6">
				{/* Indicador de zona en disputa */}
				{stateIntelligence.carteles.length > 1 && (
					<div className="bg-orange-500/10 border border-orange-500/20 p-2 rounded-lg text-center">
						<span className="text-xs font-bold text-orange-400 uppercase">
							Zona en Disputa Táctica
						</span>
					</div>
				)}
				{stateIntelligence.carteles.map((cartelInfo, idx) => (
					<DetalleCartelEstado
						key={cartelInfo.id}
						cartel={cartelInfo}
						index={idx}
					/>
				))}
			</div>
		</div>
	),
);
PanelEstadoSeleccionado.displayName = "PanelEstadoSeleccionado";

export default PanelEstadoSeleccionado;
