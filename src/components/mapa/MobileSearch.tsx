"use client";

import Link from "next/link";
import { ClearButton, SearchIcon } from "@/components/ui/icons";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import { localizeHref } from "@/paraglide/runtime";
import { useBusqueda, useMapStore } from "@/store/mapStore";

// Barra de búsqueda flotante del mapa en móvil (estilo Google Maps)
export default function MobileSearch() {
	const locale = useLocale();
	const busqueda = useBusqueda();
	const establecerBusqueda = useMapStore((s) => s.establecerBusqueda);

	return (
		<div className="md:hidden fixed left-3 right-3 top-[calc(76px+env(safe-area-inset-top))] z-40 flex items-center gap-2">
			<Link
				href={localizeHref("/", { locale })}
				aria-label={m.nav_home({}, { locale })}
				className="w-11 h-11 shrink-0 rounded-full bg-card/90 backdrop-blur-md border border-border-subtle shadow-float flex items-center justify-center text-secondary transition-colors active:bg-hover"
			>
				←
			</Link>

			<div className="relative flex-1">
				<input
					type="text"
					id="busqueda-mapa-movil"
					name="busqueda-movil"
					aria-label={m.sidebar_search_label({}, { locale })}
					placeholder={m.sidebar_search_placeholder({}, { locale })}
					value={busqueda}
					onChange={(e) => establecerBusqueda(e.target.value)}
					autoComplete="off"
					spellCheck={false}
					className="w-full h-12 rounded-full bg-card/90 backdrop-blur-md border border-border-subtle shadow-float pl-11 pr-12 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-accent/60 transition-colors"
				/>
				<SearchIcon />
				{busqueda && <ClearButton onClick={() => establecerBusqueda("")} />}
			</div>
		</div>
	);
}
