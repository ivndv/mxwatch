import React from "react";

interface Props {
	stateCount: number;
	cartelsCount: number;
}

// Estadísticas rápidas: total de cárteles y estados documentados
const EstadisticasRapidas = React.memo(
	({ stateCount, cartelsCount }: Props) => (
		<div className="grid grid-cols-2 gap-3">
			<div className="bg-input border border-white/5 rounded-lg p-3 flex flex-col py-4">
				<span className="text-[10px] uppercase font-bold text-tertiary mb-1">
					Cárteles
				</span>
				<span className="text-2xl font-black text-primary">{cartelsCount}</span>
			</div>
			<div className="bg-input border border-white/5 rounded-lg p-3 flex flex-col py-4">
				<span className="text-[10px] uppercase font-bold text-tertiary mb-1">
					Documentados
				</span>
				<span className="text-2xl font-black text-primary">{stateCount}</span>
			</div>
		</div>
	),
);
EstadisticasRapidas.displayName = "EstadisticasRapidas";

export default EstadisticasRapidas;
