import type { StateCreator } from "zustand";
import type {
	CartelBasico,
	DetalleCartel,
	InteligenciaEstado,
	PresenciaEstado,
} from "@/schemas/api.schemas";

// Interfaz del slice de datos del mapa: presencia, inteligencia, detalle y
// listado de cárteles, cada uno con sus estados de carga/error.
export interface DatosSlice {
	// Estado de presencia por estado
	datosPresencia: PresenciaEstado[];
	cargandoDatosPresencia: boolean;
	errorDatosPresencia: string | null;

	// Estado de inteligencia (información general)
	inteligenciaEstado: InteligenciaEstado | null;
	cargandoInteligencia: boolean;
	errorInteligencia: string | null;

	// Estado del detalle del cártel seleccionado
	detalleCartel: DetalleCartel | null;
	cargandoDetalleCartel: boolean;
	errorDetalleCartel: string | null;

	// Estado del listado global de cárteles
	todosCarteles: CartelBasico[];
	cargandoCarteles: boolean;
	errorCarteles: string | null;

	// Acciones — almacenan/marcan estados de carga y errores
	establecerDatosPresencia: (data: PresenciaEstado[]) => void;
	establecerCargandoDatosPresencia: (v: boolean) => void;
	establecerErrorDatosPresencia: (e: string | null) => void;
	establecerInteligenciaEstado: (data: InteligenciaEstado | null) => void;
	establecerCargandoInteligencia: (v: boolean) => void;
	establecerErrorInteligencia: (e: string | null) => void;
	establecerDetalleCartel: (data: DetalleCartel | null) => void;
	establecerCargandoDetalleCartel: (v: boolean) => void;
	establecerErrorDetalleCartel: (e: string | null) => void;
	establecerTodosCarteles: (data: CartelBasico[]) => void;
	establecerCargandoCarteles: (v: boolean) => void;
	establecerErrorCarteles: (e: string | null) => void;
	reiniciarDatos: () => void;
}

// Crea el store con los campos iniciados en vacío y expone los setters
// para manipular presencia, inteligencia, detalle y listado de cárteles.
export const crearDatosSlice: StateCreator<DatosSlice, [], [], DatosSlice> = (
	set,
) => ({
	// Valores iniciales del store de datos
	datosPresencia: [],
	cargandoDatosPresencia: false,
	errorDatosPresencia: null,
	inteligenciaEstado: null,
	cargandoInteligencia: false,
	errorInteligencia: null,
	detalleCartel: null,
	cargandoDetalleCartel: false,
	errorDetalleCartel: null,
	todosCarteles: [],
	cargandoCarteles: false,
	errorCarteles: null,

	// Almacena los datos de presencia recibidos del servidor
	establecerDatosPresencia: (data) => set({ datosPresencia: data }),
	// Marca el estado de carga de presencia
	establecerCargandoDatosPresencia: (v) => set({ cargandoDatosPresencia: v }),
	// Guarda el mensaje de error de presencia
	establecerErrorDatosPresencia: (e) => set({ errorDatosPresencia: e }),

	// Almacena la inteligencia de estado recibida del servidor
	establecerInteligenciaEstado: (data) => set({ inteligenciaEstado: data }),
	// Marca el estado de carga de inteligencia
	establecerCargandoInteligencia: (v) => set({ cargandoInteligencia: v }),
	// Guarda el mensaje de error de inteligencia
	establecerErrorInteligencia: (e) => set({ errorInteligencia: e }),

	// Almacena el detalle del cártel seleccionado
	establecerDetalleCartel: (data) => set({ detalleCartel: data }),
	// Marca el estado de carga del detalle
	establecerCargandoDetalleCartel: (v) => set({ cargandoDetalleCartel: v }),
	// Guarda el mensaje de error del detalle
	establecerErrorDetalleCartel: (e) => set({ errorDetalleCartel: e }),

	// Almacena el listado global de cárteles
	establecerTodosCarteles: (data) => set({ todosCarteles: data }),
	// Marca el estado de carga del listado
	establecerCargandoCarteles: (v) => set({ cargandoCarteles: v }),
	// Guarda el mensaje de error del listado
	establecerErrorCarteles: (e) => set({ errorCarteles: e }),

	// Reinicia inteligencia, detalle y errores; conserva presencia y cárteles
	reiniciarDatos: () =>
		set({
			inteligenciaEstado: null,
			cargandoInteligencia: false,
			errorInteligencia: null,
			detalleCartel: null,
			cargandoDetalleCartel: false,
			errorDetalleCartel: null,
			errorCarteles: null,
		}),
});
