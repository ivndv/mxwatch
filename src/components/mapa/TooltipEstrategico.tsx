import React from "react";
import type { TooltipState } from "./estilosCartel";

// Tooltip que sigue al cursor mostrando el nombre del estado y su cártel
const TooltipEstrategico = React.memo(
	({ tooltip }: { tooltip: TooltipState }) => (
		<div
			className="absolute z-50 pointer-events-none transition-transform duration-75 ease-out"
			style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
		>
			<div className="bg-tooltip/95 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-2xl flex flex-col gap-1.5 min-w-[180px]">
				<span className="text-[10px] font-black uppercase tracking-widest text-tertiary">
					Estado
				</span>
				<span className="text-sm font-bold text-primary">
					{tooltip.content}
				</span>
				<div className="h-[1px] w-full bg-white/5 my-0.5" />
				<div className="flex items-center gap-2">
					<div
						className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
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
	),
);

TooltipEstrategico.displayName = "TooltipEstrategico";
export default TooltipEstrategico;
