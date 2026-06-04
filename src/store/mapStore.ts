import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crearDatosSlice, type DatosSlice } from "./datosSlice";
import { crearMapaSlice, type MapaSlice } from "./mapaSlice";

// Store combinado del mapa: estado visual (MapaSlice) y datos del servidor (DatosSlice)
type Store = MapaSlice & DatosSlice;

// Crea el store combinando los dos slices con devtools
export const useMapStore = create<Store>()(
	devtools(
		// Combina los dos slices en un solo store
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

// Selectores del mapa
export const useBusqueda = () => useMapStore((s) => s.busqueda);
export const useCartelSeleccionado = () =>
	useMapStore((s) => s.cartelSeleccionado);
export const useEstadoSeleccionado = () =>
	useMapStore((s) => s.estadoSeleccionado);

// Selectores de datos
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

// Hook que expone todos los setters de ambos slices
export const useAccionesMapa = () => {
	// Setters del mapa
	const establecerBusqueda = useMapStore((s) => s.establecerBusqueda);
	const establecerCartelSeleccionado = useMapStore(
		(s) => s.establecerCartelSeleccionado,
	);
	const alternarCartel = useMapStore((s) => s.alternarCartel);
	const establecerEstadoSeleccionado = useMapStore(
		(s) => s.establecerEstadoSeleccionado,
	);
	const reiniciarMapa = useMapStore((s) => s.reiniciarMapa);

	// Setters de datos
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

	// Retorna todos los setters para usarlos en componentes
	return {
		// Mapa
		establecerBusqueda,
		establecerCartelSeleccionado,
		alternarCartel,
		establecerEstadoSeleccionado,
		reiniciarMapa,

		// Datos
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
