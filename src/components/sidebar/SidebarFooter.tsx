import React from "react";

// Footer del panel lateral con información de versión
export const SidebarFooter = React.memo(() => (
	<div className="p-4 border-t border-white/5 mt-auto flex flex-col items-center gap-2">
		<span className="text-[10px] uppercase tracking-widest text-tertiary font-medium">
			Actualizado: Marzo 2026
		</span>
		<span className="text-[9px] text-tertiary uppercase tracking-widest opacity-40">
			Intelligence System v1.4.2
		</span>
	</div>
));

SidebarFooter.displayName = "SidebarFooter";
