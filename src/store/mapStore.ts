import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crearMapaSlice, type MapaSlice } from "./mapaSlice";

// Store de estado de UI del mapa; los datos del servidor viven en TanStack Query
export const useMapStore = create<MapaSlice>()(
	devtools(crearMapaSlice, {
		name: "MapStore",
		enabled: process.env.NODE_ENV === "development",
	}),
);

// Selectores del mapa
export const useBusqueda = () => useMapStore((s) => s.busqueda);
export const useCartelSeleccionado = () =>
	useMapStore((s) => s.cartelSeleccionado);
export const useEstadoSeleccionado = () =>
	useMapStore((s) => s.estadoSeleccionado);

// Acciones del mapa
export const useAccionesMapa = () => {
	const establecerBusqueda = useMapStore((s) => s.establecerBusqueda);
	const establecerCartelSeleccionado = useMapStore(
		(s) => s.establecerCartelSeleccionado,
	);
	const alternarCartel = useMapStore((s) => s.alternarCartel);
	const establecerEstadoSeleccionado = useMapStore(
		(s) => s.establecerEstadoSeleccionado,
	);
	const reiniciarMapa = useMapStore((s) => s.reiniciarMapa);

	return {
		establecerBusqueda,
		establecerCartelSeleccionado,
		alternarCartel,
		establecerEstadoSeleccionado,
		reiniciarMapa,
	};
};
