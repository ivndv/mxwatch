import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";

interface Props {
	stateCount: number;
	cartelsCount: number;
}

// Estadísticas rápidas: total de cárteles y estados documentados
const EstadisticasRapidas = ({ stateCount, cartelsCount }: Props) => {
	const locale = useLocale();
	return (
		<div className="flex items-baseline gap-2 text-xs text-tertiary">
			<span className="font-mono text-base font-medium text-primary tabular-nums">
				{cartelsCount}
			</span>
			<span>{m.stats_cartels({}, { locale })}</span>
			<span className="text-border-strong">/</span>
			<span className="font-mono text-base font-medium text-primary tabular-nums">
				{stateCount}
			</span>
			<span>{m.stats_documented({}, { locale })}</span>
		</div>
	);
};

export default EstadisticasRapidas;
