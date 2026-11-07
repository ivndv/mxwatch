import React, { useMemo } from "react";
import { CheckIcon } from "@/components/ui/icons";
import { useLocale } from "@/i18n/LocaleProvider";
import { normalizarTexto } from "@/lib/mapa";
import { useCarteles, usePresencia } from "@/lib/useMapaQueries";
import * as m from "@/paraglide/messages";
import { useCartelSeleccionado, useMapStore } from "@/store/mapStore";

// Leyenda interactiva de cárteles con filtro y selección
const LeyendaCarteles = React.memo(() => {
	const locale = useLocale();
	// Estado del servidor y selección
	const { data: todosCarteles = [] } = useCarteles();
	const { data: datosPresencia = [] } = usePresencia();
	const cartelSeleccionado = useCartelSeleccionado();
	const alternarCartel = useMapStore((s) => s.alternarCartel);
	const establecerEstadoSeleccionado = useMapStore(
		(s) => s.establecerEstadoSeleccionado,
	);
	const establecerBusqueda = useMapStore((s) => s.establecerBusqueda);
	const busqueda = useMapStore((s) => s.busqueda);

	// Selecciona el cártel y limpia búsqueda/estado
	const seleccionarCartel = (id: string, yaSeleccionado: boolean) => {
		alternarCartel(id);
		if (yaSeleccionado) return;
		establecerEstadoSeleccionado(null);
		establecerBusqueda("");
	};

	// Filtra cárteles por texto de búsqueda
	const cartelesFiltrados = useMemo(() => {
		if (!busqueda) return todosCarteles;
		const q = normalizarTexto(busqueda);
		return todosCarteles.filter((c) => normalizarTexto(c.nombre).includes(q));
	}, [todosCarteles, busqueda]);

	// Cuenta en cuántos estados tiene presencia cada cártel
	const conteoPorCartel = useMemo(() => {
		return datosPresencia.reduce<Record<string, number>>((acc, infoEstado) => {
			infoEstado.carteles.forEach((c) => {
				acc[c.slug] = (acc[c.slug] ?? 0) + 1;
				acc[c.id] = (acc[c.id] ?? 0) + 1;
			});
			return acc;
		}, {});
	}, [datosPresencia]);

	if (cartelesFiltrados.length === 0)
		return (
			<div className="text-center py-6 text-tertiary text-[13px]">
				{m.legend_empty({}, { locale })}
			</div>
		);

	return (
		<div className="flex flex-col gap-2">
			{/* Encabezado con botón de limpiar selección */}
			<h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary flex items-center gap-2">
				{m.legend_title({}, { locale })}
				{cartelSeleccionado && (
					<button
						type="button"
						onClick={() => alternarCartel(cartelSeleccionado)}
						className="ml-auto text-[11px] font-medium text-tertiary hover:text-primary transition-colors"
					>
						{m.legend_clear({}, { locale })}
					</button>
				)}
			</h3>

			{/* Lista de cárteles */}
			<div className="flex flex-col gap-0.5">
				{cartelesFiltrados.map((cartel) => {
					const isSelected =
						cartelSeleccionado === cartel.id ||
						cartelSeleccionado === cartel.slug;
					const count =
						(conteoPorCartel[cartel.slug] ?? 0) ||
						(conteoPorCartel[cartel.id] ?? 0);
					return (
						<button
							type="button"
							key={cartel.id}
							onClick={() =>
								seleccionarCartel(cartel.slug || cartel.id, isSelected)
							}
							className={`relative flex items-center gap-3 px-2.5 min-h-11 rounded-lg transition-colors text-left w-full ${
								isSelected ? "bg-elevated" : "hover:bg-hover"
							} ${cartelSeleccionado && !isSelected ? "opacity-40" : "opacity-100"}`}
						>
							{isSelected && (
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
								{count}
							</span>
							{isSelected && <CheckIcon color="var(--accent)" />}
						</button>
					);
				})}
			</div>
		</div>
	);
});
LeyendaCarteles.displayName = "LeyendaCarteles";

export default LeyendaCarteles;
