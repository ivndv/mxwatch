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
				className="absolute left-0 top-0 z-50 pointer-events-none"
				style={{
					transform: `translate3d(${tooltip.x + 15}px, ${tooltip.y + 15}px, 0)`,
				}}
			>
				<div className="bg-tooltip/95 backdrop-blur-md border border-border-subtle rounded-lg p-3 shadow-float flex flex-col gap-2 min-w-[160px]">
					<span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-tertiary">
						{m.map_tooltip_state({}, { locale })}
					</span>
					<span className="text-sm font-semibold text-primary">
						{tooltip.content}
					</span>
					<div className="h-px w-full bg-border-subtle" />
					<div className="flex items-center gap-2">
						<span
							className="w-2.5 h-2.5 rounded-full flex-shrink-0"
							style={{ backgroundColor: tooltip.color }}
						/>
						<span
							className="text-xs font-mono font-medium"
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
