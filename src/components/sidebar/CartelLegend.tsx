import React, { useMemo } from "react";
import {
	useCartelSeleccionado,
	useDatosPresencia,
	useMapStore,
	useTodosCarteles,
} from "@/store/mapStore";
import { CheckIcon } from "./ui";

const CartelLegend = React.memo(() => {
	const todosCarteles = useTodosCarteles();
	const cartelSeleccionado = useCartelSeleccionado();
	const datosPresencia = useDatosPresencia();
	const alternarCartel = useMapStore((s) => s.alternarCartel);
	const busqueda = useMapStore((s) => s.busqueda);

	const cartelesFiltrados = useMemo(() => {
		if (!busqueda) return todosCarteles;
		return todosCarteles.filter((c) =>
			c.nombre.toLowerCase().includes(busqueda.toLowerCase()),
		);
	}, [todosCarteles, busqueda]);

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
				Sin resultados en el sector
			</div>
		);

	return (
		<div className="flex flex-col gap-3">
			<h3 className="text-xs font-bold uppercase text-secondary tracking-wider flex items-center gap-2">
				Despliegue Territorial
				{cartelSeleccionado && (
					<button
						type="button"
						onClick={() => alternarCartel(cartelSeleccionado)}
						className="ml-auto text-[9px] text-accent font-medium"
					>
						Limpiar ×
					</button>
				)}
			</h3>

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
							className={`flex items-center gap-3 p-2 rounded-md transition-all text-left w-full group ${isSelected ? "bg-hover border border-accent/30" : "hover:bg-input border border-transparent"} ${cartelSeleccionado && !isSelected ? "opacity-30" : "opacity-100"}`}
						>
							<div
								className="w-3 h-3 rounded-sm shadow-sm"
								style={{ backgroundColor: cartel.color }}
							/>
							<span className="text-sm font-medium flex-1 truncate text-primary">
								{cartel.nombre}
							</span>
							<span
								className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
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
CartelLegend.displayName = "CartelLegend";

export default CartelLegend;
