import React from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import type { TooltipState } from "@/types/mapa";

// Tooltip que sigue al cursor mostrando el nombre del estado y su cártel
const TooltipEstrategico = React.memo(
	({ tooltip }: { tooltip: TooltipState }) => {
		const locale = useLocale();
		return (
			<div
				className="absolute z-50 pointer-events-none transition-transform duration-75 ease-out"
				style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
			>
				<div className="bg-tooltip/95 backdrop-blur-md border border-border rounded-md p-2.5 shadow-2xl flex flex-col gap-1.5 min-w-[160px]">
					<span className="text-[11px] font-bold uppercase tracking-wide text-tertiary">
						{m.map_tooltip_state({}, { locale })}
					</span>
					<span className="text-sm font-bold text-primary">
						{tooltip.content}
					</span>
					<div className="h-[1px] w-full bg-elevated my-0.5" />
					<div className="flex items-center gap-2">
						<div
							className="w-2.5 h-2.5 rounded-[3px] flex-shrink-0"
							style={{ backgroundColor: tooltip.color }}
						/>
						<span
							className="text-xs font-mono font-bold"
							style={{ color: tooltip.color }}
						>
							{tooltip.cartel}
						</span>
					</div>
				</div>
			</div>
		);
	},
);

TooltipEstrategico.displayName = "TooltipEstrategico";
export default TooltipEstrategico;
