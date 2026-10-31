import React, { useMemo } from "react";
import { CheckIcon } from "@/components/ui/icons";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import {
	useCartelSeleccionado,
	useDatosPresencia,
	useMapStore,
	useTodosCarteles,
} from "@/store/mapStore";

// Leyenda interactiva de cárteles con filtro y selección
const LeyendaCarteles = React.memo(() => {
	const locale = useLocale();
	// Selectores del store
	const todosCarteles = useTodosCarteles();
	const cartelSeleccionado = useCartelSeleccionado();
	const datosPresencia = useDatosPresencia();
	const alternarCartel = useMapStore((s) => s.alternarCartel);
	const busqueda = useMapStore((s) => s.busqueda);

	// Filtra cárteles por texto de búsqueda
	const cartelesFiltrados = useMemo(() => {
		if (!busqueda) return todosCarteles;
		return todosCarteles.filter((c) =>
			c.nombre.toLowerCase().includes(busqueda.toLowerCase()),
		);
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
			<div className="text-center py-8 text-tertiary text-xs">
				{m.legend_empty({}, { locale })}
			</div>
		);

	return (
		<div className="flex flex-col gap-3">
			{/* Encabezado con botón de limpiar selección */}
			<h3 className="text-xs font-bold uppercase text-secondary tracking-wider flex items-center gap-2">
				{m.legend_title({}, { locale })}
				{cartelSeleccionado && (
					<button
						type="button"
						onClick={() => alternarCartel(cartelSeleccionado)}
						className="ml-auto text-[11px] text-accent font-medium"
					>
						{m.legend_clear({}, { locale })}
					</button>
				)}
			</h3>

			{/* Lista de cárteles */}
			<div className="flex flex-col gap-1.5">
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
							onClick={() => alternarCartel(cartel.slug || cartel.id)}
							className={`flex items-center gap-3 p-2 rounded-md transition-all text-left w-full group ${isSelected ? "bg-accent/5 ring-1 ring-accent/40 border border-transparent" : "hover:bg-hover border border-transparent"} ${cartelSeleccionado && !isSelected ? "opacity-30" : "opacity-100"}`}
						>
							<div
								className="w-3 h-3 rounded-[3px] shadow-sm"
								style={{ backgroundColor: cartel.color }}
							/>
							<span className="text-sm font-medium flex-1 truncate text-primary">
								{cartel.nombre}
							</span>
							<span
								className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
								style={{
									backgroundColor: `${cartel.color}25`,
									color: cartel.color,
								}}
							>
								{count}
							</span>
							{isSelected && <CheckIcon color={cartel.color} />}
						</button>
					);
				})}
			</div>
		</div>
	);
});
LeyendaCarteles.displayName = "LeyendaCarteles";

export default LeyendaCarteles;
