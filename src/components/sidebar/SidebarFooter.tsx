import React from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";

// Footer del panel lateral con información de versión
export const SidebarFooter = React.memo(() => {
	const locale = useLocale();
	return (
		<div className="p-4 border-t border-border-subtle mt-auto flex flex-col items-center gap-2">
			<span className="text-[11px] uppercase tracking-wide text-tertiary font-medium">
				{m.sidebar_updated({}, { locale })}
			</span>
			<span className="text-[11px] text-tertiary uppercase tracking-wide opacity-40">
				{m.sidebar_version({}, { locale })}
			</span>
		</div>
	);
});

SidebarFooter.displayName = "SidebarFooter";
