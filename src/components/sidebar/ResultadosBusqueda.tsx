import { useMemo } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import {
	useBusqueda,
	useDatosPresencia,
	useEstadoSeleccionado,
	useMapStore,
} from "@/store/mapStore";

// Resultados de búsqueda filtrados por estado o cártel
const ResultadosBusqueda = () => {
	const locale = useLocale();
	const busqueda = useBusqueda();
	const datosPresencia = useDatosPresencia();
	const estadoSeleccionado = useEstadoSeleccionado();
	const establecerEstadoSeleccionado = useMapStore(
		(s) => s.establecerEstadoSeleccionado,
	);

	// Filtra estados por nombre o cártel coincidente
	const estadosFiltrados = useMemo(() => {
		if (!busqueda) return [];
		const q = busqueda.toLowerCase();
		return datosPresencia.filter(
			(e) =>
				e.nombre_estado.toLowerCase().includes(q) ||
				e.carteles.some(
					(c) =>
						c.nombre.toLowerCase().includes(q) ||
						c.slug.toLowerCase().includes(q),
				),
		);
	}, [datosPresencia, busqueda]);

	if (!busqueda || estadosFiltrados.length === 0) return null;

	return (
		<div className="flex flex-col gap-2">
			<h3 className="text-xs font-bold uppercase text-secondary tracking-wider">
				{m.search_states({ count: estadosFiltrados.length }, { locale })}
			</h3>
			{/* Lista de estados coincidentes */}
			<div className="flex flex-col gap-1">
				{estadosFiltrados.map((e) => {
					const esSeleccionado = estadoSeleccionado === e.nombre_estado;
					return (
						<button
							type="button"
							key={e.slug_estado}
							onClick={() =>
								establecerEstadoSeleccionado(
									estadoSeleccionado === e.nombre_estado
										? null
										: e.nombre_estado,
								)
							}
							className={`flex items-center gap-3 p-2 rounded-md transition-all text-left w-full group ${
								esSeleccionado
									? "bg-accent/5 ring-1 ring-accent/40 border border-transparent"
									: "hover:bg-hover border border-transparent"
							}`}
						>
							<span className="text-sm font-medium flex-1 truncate text-primary">
								{e.nombre_estado}
							</span>
							<span className="text-[11px] font-bold text-tertiary">
								{m.search_cartel_count(
									{ count: e.carteles.length },
									{ locale },
								)}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default ResultadosBusqueda;
