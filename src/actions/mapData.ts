"use server";

import { z } from "zod";
import {
	CartelBasicoSchema,
	DetalleCartelSchema,
	InteligenciaEstadoSchema,
	PresenciaEstadoSchema,
	parsearRespuesta,
} from "@/schemas/api.schemas";

// URL base del backend
const API_URL = process.env.API_URL || "http://localhost:3001";

// Trae los datos de presencia por estado
export async function obtenerDatosMapa() {
	try {
		// Fetch al backend con la API key para autenticación server-to-server.
		const res = await fetch(`${API_URL}/api/map`, {
			headers: { "x-api-key": process.env.API_KEY || "" },
		});
		// parsearRespuesta valida con Zod: si falla HTTP o el schema, retorna null.
		return (await parsearRespuesta(res, z.array(PresenciaEstadoSchema))) ?? [];
	} catch (error) {
		// Error de red (servidor caído, DNS, timeout) o JSON malformado.
		console.error("Error de red/JSON [obtenerDatosMapa]:", error);
		return [];
	}
}

// Trae el detalle de un cártel específico por su slug (ej: "cártel-de-sinaloa").
export async function obtenerDetalleCartel(slug: string) {
	try {
		// Fetch al backend con la API key para autenticación server-to-server.
		const res = await fetch(
			`${API_URL}/api/cartel/${encodeURIComponent(slug)}`,
			{ headers: { "x-api-key": process.env.API_KEY || "" } },
		);
		// parsearRespuesta valida con Zod: si falla HTTP o el schema, retorna null.
		return await parsearRespuesta(res, DetalleCartelSchema);
	} catch (error) {
		// Error de red (servidor caído, DNS, timeout) o JSON malformado.
		console.error("Error de red/JSON [obtenerDetalleCartel]:", error);
		return null;
	}
}

// Trae la lista completa de cárteles para mostrar en la sidebar.
export async function obtenerCarteles() {
	try {
		// Fetch al backend con la API key para autenticación server-to-server.
		const res = await fetch(`${API_URL}/api/cartels`, {
			headers: { "x-api-key": process.env.API_KEY || "" },
		});
		// parsearRespuesta valida con Zod: si falla HTTP o el schema, retorna null.
		return (await parsearRespuesta(res, z.array(CartelBasicoSchema))) ?? [];
	} catch (error) {
		// Error de red (servidor caído, DNS, timeout) o JSON malformado.
		console.error("Error de red/JSON [obtenerCarteles]:", error);
		return [];
	}
}

// Trae inteligencia detallada de un estado (análisis, eventos, estadísticas).
export async function obtenerInteligenciaEstado(nombreEstado: string) {
	try {
		// Fetch al backend con la API key para autenticación server-to-server.
		const res = await fetch(
			`${API_URL}/api/state/${encodeURIComponent(nombreEstado)}`,
			{ headers: { "x-api-key": process.env.API_KEY || "" } },
		);
		// parsearRespuesta valida con Zod: si falla HTTP o el schema, retorna null.
		return await parsearRespuesta(res, InteligenciaEstadoSchema);
	} catch (error) {
		// Error de red (servidor caído, DNS, timeout) o JSON malformado.
		console.error("Error de red/JSON [obtenerInteligenciaEstado]:", error);
		return null;
	}
}
