import type { StateCreator } from "zustand";

export interface MapaSlice {
	busqueda: string;
	cartelSeleccionado: string | null;
	estadoSeleccionado: string | null;
	establecerBusqueda: (query: string) => void;
	establecerCartelSeleccionado: (id: string | null) => void;
	alternarCartel: (id: string) => void;
	establecerEstadoSeleccionado: (nombre: string | null) => void;
	reiniciarMapa: () => void;
}

export const crearMapaSlice: StateCreator<MapaSlice, [], [], MapaSlice> = (
	set,
	get,
) => ({
	busqueda: "",
	cartelSeleccionado: null,
	estadoSeleccionado: null,

	establecerBusqueda: (query) => set({ busqueda: query }),

	establecerCartelSeleccionado: (id) => set({ cartelSeleccionado: id }),

	alternarCartel: (id) => {
		const { cartelSeleccionado } = get();
		set({ cartelSeleccionado: cartelSeleccionado === id ? null : id });
	},

	establecerEstadoSeleccionado: (nombre) => set({ estadoSeleccionado: nombre }),

	reiniciarMapa: () =>
		set({ busqueda: "", cartelSeleccionado: null, estadoSeleccionado: null }),
});
