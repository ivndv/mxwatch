import React from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";

interface Props {
	stateCount: number;
	cartelsCount: number;
}

// Estadísticas rápidas: total de cárteles y estados documentados
const EstadisticasRapidas = React.memo(
	({ stateCount, cartelsCount }: Props) => {
		const locale = useLocale();
		return (
			<div className="grid grid-cols-2 gap-3">
				<div className="bg-input border border-border-subtle rounded-lg p-3 flex flex-col py-4">
					<span className="text-[11px] uppercase font-bold text-tertiary mb-1">
						{m.stats_cartels({}, { locale })}
					</span>
					<span className="text-xl font-bold text-primary">{cartelsCount}</span>
				</div>
				<div className="bg-input border border-border-subtle rounded-lg p-3 flex flex-col py-4">
					<span className="text-[11px] uppercase font-bold text-tertiary mb-1">
						{m.stats_documented({}, { locale })}
					</span>
					<span className="text-xl font-bold text-primary">{stateCount}</span>
				</div>
			</div>
		);
	},
);
EstadisticasRapidas.displayName = "EstadisticasRapidas";

export default EstadisticasRapidas;
