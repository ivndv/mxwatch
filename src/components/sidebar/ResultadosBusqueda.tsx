import { useMemo } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { clasificarBusqueda, normalizarTexto } from "@/lib/mapa";
import { useCarteles, usePresencia } from "@/lib/useMapaQueries";
import * as m from "@/paraglide/messages";
import type { CartelBasico } from "@/schemas/api";
import {
	useBusqueda,
	useCartelSeleccionado,
	useEstadoSeleccionado,
	useMapStore,
} from "@/store/mapStore";

// Resultados de búsqueda agrupados por estado y cártel
const ResultadosBusqueda = () => {
	const locale = useLocale();
	const busqueda = useBusqueda();
	const { data: datosPresencia = [] } = usePresencia();
	const { data: todosCarteles = [] } = useCarteles();
	const estadoSeleccionado = useEstadoSeleccionado();
	const cartelSeleccionado = useCartelSeleccionado();
	const establecerEstadoSeleccionado = useMapStore(
		(s) => s.establecerEstadoSeleccionado,
	);
	const establecerCartelSeleccionado = useMapStore(
		(s) => s.establecerCartelSeleccionado,
	);
	const establecerBusqueda = useMapStore((s) => s.establecerBusqueda);

	// Los estados tienen prioridad; si no hay, busca por cártel
	const clasificacion = useMemo(
		() => clasificarBusqueda(datosPresencia, busqueda),
		[datosPresencia, busqueda],
	);
	const estados = clasificacion.estados;

	const carteles = useMemo(() => {
		const q = normalizarTexto(busqueda.trim());
		if (!q) return [];
		return todosCarteles.filter(
			(cartel) =>
				normalizarTexto(cartel.nombre).includes(q) ||
				normalizarTexto(cartel.slug).includes(q),
		);
	}, [todosCarteles, busqueda]);

	if (!busqueda) return null;

	const seleccionarEstado = (nombreEstado: string) => {
		const yaSeleccionado = estadoSeleccionado === nombreEstado;
		establecerEstadoSeleccionado(yaSeleccionado ? null : nombreEstado);
		if (yaSeleccionado) return;
		establecerCartelSeleccionado(null);
		establecerBusqueda("");
	};

	const seleccionarCartel = (cartel: CartelBasico) => {
		establecerEstadoSeleccionado(null);
		establecerCartelSeleccionado(cartel.slug);
		establecerBusqueda("");
	};

	const contarPresencia = (cartel: CartelBasico) =>
		datosPresencia.filter((estado) =>
			estado.carteles.some((c) => c.slug === cartel.slug || c.id === cartel.id),
		).length;

	return (
		<div className="flex flex-col gap-5">
			{estados.length === 0 && carteles.length === 0 && (
				<p className="text-[13px] text-tertiary text-center py-6">
					{m.search_no_results({ query: busqueda }, { locale })}
				</p>
			)}

			{estados.length > 0 && (
				<section className="flex flex-col gap-2">
					<h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
						{m.search_states({ count: estados.length }, { locale })}
					</h3>
					<div className="flex flex-col gap-0.5">
						{estados.map((e) => {
							const esSeleccionado = estadoSeleccionado === e.nombre_estado;
							return (
								<button
									type="button"
									key={e.slug_estado}
									onClick={() => seleccionarEstado(e.nombre_estado)}
									className={`relative flex items-center gap-3 px-2.5 min-h-11 rounded-lg transition-colors text-left w-full ${
										esSeleccionado ? "bg-elevated" : "hover:bg-hover"
									}`}
								>
									{esSeleccionado && (
										<span
											aria-hidden="true"
											className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full bg-accent"
										/>
									)}
									<span className="text-sm font-medium flex-1 truncate text-primary">
										{e.nombre_estado}
									</span>
									<span className="font-mono text-[11px] text-tertiary tabular-nums">
										{m.search_cartel_count(
											{ count: e.carteles.length },
											{ locale },
										)}
									</span>
								</button>
							);
						})}
					</div>
				</section>
			)}

			{carteles.length > 0 && (
				<section className="flex flex-col gap-2">
					<h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
						{m.search_cartels({ count: carteles.length }, { locale })}
					</h3>
					<div className="flex flex-col gap-0.5">
						{carteles.map((cartel) => {
							const esSeleccionado =
								cartelSeleccionado === cartel.slug ||
								cartelSeleccionado === cartel.id;
							return (
								<button
									type="button"
									key={cartel.id}
									onClick={() => seleccionarCartel(cartel)}
									className={`relative flex items-center gap-3 px-2.5 min-h-11 rounded-lg transition-colors text-left w-full ${
										esSeleccionado ? "bg-elevated" : "hover:bg-hover"
									}`}
								>
									{esSeleccionado && (
										<span
											aria-hidden="true"
											className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full bg-accent"
										/>
									)}
									<span
										className="w-2.5 h-2.5 rounded-full shrink-0"
										style={{ backgroundColor: cartel.color }}
									/>
									<span className="text-sm font-medium flex-1 truncate text-primary">
										{cartel.nombre}
									</span>
									<span className="font-mono text-[11px] text-tertiary tabular-nums">
										{m.search_presence(
											{ count: contarPresencia(cartel) },
											{ locale },
										)}
									</span>
								</button>
							);
						})}
					</div>
				</section>
			)}
		</div>
	);
};

export default ResultadosBusqueda;
