"use client";

import { skipToken, useQuery } from "@tanstack/react-query";
import {
	obtenerCarteles,
	obtenerDatosMapa,
	obtenerDetalleCartel,
	obtenerInteligenciaEstado,
} from "@/actions/mapData";

// Claves estables para la caché de TanStack
const CLAVES = {
	presencia: ["mxwatch", "presencia"] as const,
	carteles: ["mxwatch", "carteles"] as const,
	inteligencia: (estado: string) =>
		["mxwatch", "inteligencia", estado] as const,
	cartel: (slug: string) => ["mxwatch", "cartel", slug] as const,
};

// Presencia territorial por estado
export function usePresencia() {
	return useQuery({
		queryKey: CLAVES.presencia,
		queryFn: obtenerDatosMapa,
	});
}

// Listado completo de cárteles
export function useCarteles() {
	return useQuery({
		queryKey: CLAVES.carteles,
		queryFn: obtenerCarteles,
	});
}

// Inteligencia del estado seleccionado
export function useInteligencia(estado: string | null) {
	return useQuery({
		queryKey: CLAVES.inteligencia(estado ?? ""),
		queryFn: estado ? () => obtenerInteligenciaEstado(estado) : skipToken,
	});
}

// Detalle del cártel seleccionado
export function useDetalleCartel(slug: string | null) {
	return useQuery({
		queryKey: CLAVES.cartel(slug ?? ""),
		queryFn: slug ? () => obtenerDetalleCartel(slug) : skipToken,
	});
}
