import React from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";

// Footer del panel lateral con la fecha de los datos
export const SidebarFooter = React.memo(
	({ actualizadoEn }: { actualizadoEn: number | null }) => {
		const locale = useLocale();
		const fecha = actualizadoEn
			? new Intl.DateTimeFormat(locale === "es" ? "es-MX" : "en-US", {
					dateStyle: "medium",
					timeStyle: "short",
				}).format(new Date(actualizadoEn))
			: null;

		return (
			<div className="flex items-center min-h-11 px-5 py-2 border-t border-border-subtle mt-auto pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
				{fecha && (
					<span className="font-mono text-[11px] text-tertiary tabular-nums">
						{m.sidebar_updated_at({ fecha }, { locale })}
					</span>
				)}
			</div>
		);
	},
);

SidebarFooter.displayName = "SidebarFooter";
