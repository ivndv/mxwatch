"use server";

import { z } from "zod";
import { parsearRespuesta } from "@/lib/api";
import type {
	CartelBasico,
	DetalleCartel,
	InteligenciaEstado,
	PresenciaEstado,
} from "@/schemas/api";
import {
	CartelBasicoSchema,
	DetalleCartelSchema,
	InteligenciaEstadoSchema,
	PresenciaEstadoSchema,
} from "@/schemas/api";

// URL base del backend
const API_URL = process.env.API_URL || "http://localhost:3001";

// Cabecera de autenticación server-to-server
function cabeceras(): Record<string, string> {
	return { "x-api-key": process.env.API_KEY || "" };
}

// Trae los datos de presencia por estado
export async function obtenerDatosMapa(): Promise<PresenciaEstado[]> {
	const res = await fetch(`${API_URL}/api/map`, { headers: cabeceras() });
	return (await parsearRespuesta(res, z.array(PresenciaEstadoSchema))) ?? [];
}

// Trae el detalle de un cártel por su slug
export async function obtenerDetalleCartel(
	slug: string,
): Promise<DetalleCartel | null> {
	const res = await fetch(`${API_URL}/api/cartel/${encodeURIComponent(slug)}`, {
		headers: cabeceras(),
	});
	return parsearRespuesta(res, DetalleCartelSchema);
}

// Trae la lista completa de cárteles
export async function obtenerCarteles(): Promise<CartelBasico[]> {
	const res = await fetch(`${API_URL}/api/cartels`, { headers: cabeceras() });
	return (await parsearRespuesta(res, z.array(CartelBasicoSchema))) ?? [];
}

// Trae la inteligencia de un estado
export async function obtenerInteligenciaEstado(
	nombreEstado: string,
): Promise<InteligenciaEstado | null> {
	const res = await fetch(
		`${API_URL}/api/state/${encodeURIComponent(nombreEstado)}`,
		{ headers: cabeceras() },
	);
	return parsearRespuesta(res, InteligenciaEstadoSchema);
}
