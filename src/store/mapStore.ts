import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crearDatosSlice, type DatosSlice } from "./datosSlice";
import { crearMapaSlice, type MapaSlice } from "./mapaSlice";

type Store = MapaSlice & DatosSlice;

export const useMapStore = create<Store>()(
	devtools(
		(...a) => ({
			...crearMapaSlice(...(a as Parameters<typeof crearMapaSlice>)),
			...crearDatosSlice(...(a as Parameters<typeof crearDatosSlice>)),
		}),
		{
			name: "MapStore",
			enabled: process.env.NODE_ENV === "development",
		},
	),
);

// Mapa
export const useBusqueda = () => useMapStore((s) => s.busqueda);
export const useCartelSeleccionado = () =>
	useMapStore((s) => s.cartelSeleccionado);
export const useEstadoSeleccionado = () =>
	useMapStore((s) => s.estadoSeleccionado);

// Datos
export const useDatosPresencia = () => useMapStore((s) => s.datosPresencia);
export const useCargandoDatosPresencia = () =>
	useMapStore((s) => s.cargandoDatosPresencia);
export const useErrorDatosPresencia = () =>
	useMapStore((s) => s.errorDatosPresencia);
export const useInteligenciaEstado = () =>
	useMapStore((s) => s.inteligenciaEstado);
export const useCargandoInteligencia = () =>
	useMapStore((s) => s.cargandoInteligencia);
export const useErrorInteligencia = () =>
	useMapStore((s) => s.errorInteligencia);
export const useDetalleCartel = () => useMapStore((s) => s.detalleCartel);
export const useCargandoDetalleCartel = () =>
	useMapStore((s) => s.cargandoDetalleCartel);
export const useErrorDetalleCartel = () =>
	useMapStore((s) => s.errorDetalleCartel);
export const useTodosCarteles = () => useMapStore((s) => s.todosCarteles);
export const useCargandoCarteles = () => useMapStore((s) => s.cargandoCarteles);
export const useErrorCarteles = () => useMapStore((s) => s.errorCarteles);

// Acciones
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
	const establecerDatosPresencia = useMapStore(
		(s) => s.establecerDatosPresencia,
	);
	const establecerCargandoDatosPresencia = useMapStore(
		(s) => s.establecerCargandoDatosPresencia,
	);
	const establecerErrorDatosPresencia = useMapStore(
		(s) => s.establecerErrorDatosPresencia,
	);
	const establecerInteligenciaEstado = useMapStore(
		(s) => s.establecerInteligenciaEstado,
	);
	const establecerCargandoInteligencia = useMapStore(
		(s) => s.establecerCargandoInteligencia,
	);
	const establecerErrorInteligencia = useMapStore(
		(s) => s.establecerErrorInteligencia,
	);
	const establecerDetalleCartel = useMapStore((s) => s.establecerDetalleCartel);
	const establecerCargandoDetalleCartel = useMapStore(
		(s) => s.establecerCargandoDetalleCartel,
	);
	const establecerErrorDetalleCartel = useMapStore(
		(s) => s.establecerErrorDetalleCartel,
	);
	const establecerTodosCarteles = useMapStore((s) => s.establecerTodosCarteles);
	const establecerCargandoCarteles = useMapStore(
		(s) => s.establecerCargandoCarteles,
	);
	const establecerErrorCarteles = useMapStore((s) => s.establecerErrorCarteles);

	return {
		establecerBusqueda,
		establecerCartelSeleccionado,
		alternarCartel,
		establecerEstadoSeleccionado,
		reiniciarMapa,
		establecerDatosPresencia,
		establecerCargandoDatosPresencia,
		establecerErrorDatosPresencia,
		establecerInteligenciaEstado,
		establecerCargandoInteligencia,
		establecerErrorInteligencia,
		establecerDetalleCartel,
		establecerCargandoDetalleCartel,
		establecerErrorDetalleCartel,
		establecerTodosCarteles,
		establecerCargandoCarteles,
		establecerErrorCarteles,
	};
};
