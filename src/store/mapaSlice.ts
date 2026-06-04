import type { StateCreator } from "zustand";

// Interfaz del slice del mapa: búsqueda, cártel seleccionado, estado
// seleccionado y las acciones para manipularlos.
export interface MapaSlice {
	// Estado de la UI del mapa
	busqueda: string;
	cartelSeleccionado: string | null;
	estadoSeleccionado: string | null;

	// Acciones del mapa
	establecerBusqueda: (query: string) => void;
	establecerCartelSeleccionado: (id: string | null) => void;
	alternarCartel: (id: string) => void;
	establecerEstadoSeleccionado: (nombre: string | null) => void;
	reiniciarMapa: () => void;
}

// Crea el store con los campos iniciados en vacío y expone los setters
// para búsqueda, selección de cártel/estado y reinicio del mapa.
export const crearMapaSlice: StateCreator<MapaSlice, [], [], MapaSlice> = (
	set,
	get,
) => ({
	// Valores iniciales del store del mapa
	busqueda: "",
	cartelSeleccionado: null,
	estadoSeleccionado: null,

	// Actualiza el texto de búsqueda
	establecerBusqueda: (query) => set({ busqueda: query }),
	// Selecciona un cártel por ID
	establecerCartelSeleccionado: (id) => set({ cartelSeleccionado: id }),
	// Alterna la selección de un cártel (toggle on/off)
	alternarCartel: (id) => {
		const { cartelSeleccionado } = get();
		set({ cartelSeleccionado: cartelSeleccionado === id ? null : id });
	},
	// Selecciona un estado por nombre
	establecerEstadoSeleccionado: (nombre) => set({ estadoSeleccionado: nombre }),
	// Reinicia búsqueda, cártel y estado seleccionado
	reiniciarMapa: () =>
		set({ busqueda: "", cartelSeleccionado: null, estadoSeleccionado: null }),
});
