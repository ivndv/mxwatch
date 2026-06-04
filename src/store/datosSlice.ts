import type { StateCreator } from "zustand";
import type {
	CartelBasico,
	DetalleCartel,
	InteligenciaEstado,
	PresenciaEstado,
} from "@/schemas/api.schemas";

export interface DatosSlice {
	datosPresencia: PresenciaEstado[];
	cargandoDatosPresencia: boolean;
	errorDatosPresencia: string | null;
	inteligenciaEstado: InteligenciaEstado | null;
	cargandoInteligencia: boolean;
	errorInteligencia: string | null;
	detalleCartel: DetalleCartel | null;
	cargandoDetalleCartel: boolean;
	errorDetalleCartel: string | null;
	todosCarteles: CartelBasico[];
	cargandoCarteles: boolean;
	errorCarteles: string | null;
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

export const crearDatosSlice: StateCreator<DatosSlice, [], [], DatosSlice> = (
	set,
) => ({
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

	establecerDatosPresencia: (data) => set({ datosPresencia: data }),

	establecerCargandoDatosPresencia: (v) => set({ cargandoDatosPresencia: v }),

	establecerErrorDatosPresencia: (e) => set({ errorDatosPresencia: e }),

	establecerInteligenciaEstado: (data) => set({ inteligenciaEstado: data }),

	establecerCargandoInteligencia: (v) => set({ cargandoInteligencia: v }),

	establecerErrorInteligencia: (e) => set({ errorInteligencia: e }),

	establecerDetalleCartel: (data) => set({ detalleCartel: data }),

	establecerCargandoDetalleCartel: (v) => set({ cargandoDetalleCartel: v }),

	establecerErrorDetalleCartel: (e) => set({ errorDetalleCartel: e }),

	establecerTodosCarteles: (data) => set({ todosCarteles: data }),

	establecerCargandoCarteles: (v) => set({ cargandoCarteles: v }),

	establecerErrorCarteles: (e) => set({ errorCarteles: e }),

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
