import { create } from "zustand";
import { persist } from "zustand/middleware";

// Preferencias posibles: seguir al sistema o forzar un tema
export type Tema = "dark" | "light" | "system";

// Tema efectivo que se aplica al documento
type TemaResuelto = "dark" | "light";

interface ThemeState {
	tema: Tema;
	establecerTema: (tema: Tema) => void;
	ciclarTema: () => void;
}

// Orden del ciclo del botón: oscuro → claro → sistema
const ORDEN: Tema[] = ["dark", "light", "system"];

// Resuelve el tema efectivo cuando la preferencia es "system"
export function resolverTema(tema: Tema): TemaResuelto {
	if (tema !== "system") return tema;
	if (typeof window === "undefined") return "dark";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

// Preferencia de tema persistida en localStorage
export const useThemeStore = create<ThemeState>()(
	persist(
		(set) => ({
			tema: "dark",

			establecerTema: (tema) => set({ tema }),

			ciclarTema: () =>
				set(({ tema }) => {
					const indice = ORDEN.indexOf(tema);
					return { tema: ORDEN[(indice + 1) % ORDEN.length] };
				}),
		}),
		{
			// La clave debe coincidir con el script anti-flash del layout
			name: "mxwatch-theme",
		},
	),
);
