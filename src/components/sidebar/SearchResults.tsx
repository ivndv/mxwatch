import { useMemo } from "react";
import {
	useBusqueda,
	useDatosPresencia,
	useEstadoSeleccionado,
	useMapStore,
} from "@/store/mapStore";

const SearchResults = () => {
	const busqueda = useBusqueda();
	const datosPresencia = useDatosPresencia();
	const estadoSeleccionado = useEstadoSeleccionado();
	const establecerEstadoSeleccionado = useMapStore(
		(s) => s.establecerEstadoSeleccionado,
	);

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
				Estados ({estadosFiltrados.length})
			</h3>
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
									? "bg-hover border border-accent/30"
									: "hover:bg-input border border-transparent"
							}`}
						>
							<span className="text-sm font-medium flex-1 truncate text-primary">
								{e.nombre_estado}
							</span>
							<span className="text-[10px] font-black text-tertiary">
								{e.carteles.length} cartel(es)
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default SearchResults;
