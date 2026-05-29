"use server";

import { hc } from "hono/client";
import { z } from "zod";
import {
	CartelBasicoSchema,
	DetalleCartelSchema,
	InteligenciaEstadoSchema,
	PresenciaEstadoSchema,
	parsearRespuesta,
} from "@/schemas/api.schemas";

const API_BASE = (
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
).replace(/\/+$/, "");
const API_URL = API_BASE.replace(/\/api$/, "");

const client = hc(API_URL, {
	headers: { "x-api-key": process.env.API_KEY || "" },
}) as unknown as {
	api: {
		map: { $get: () => Promise<Response> };
		cartels: { $get: () => Promise<Response> };
		cartel: Record<
			string,
			{ $get: (o: { param: { slug: string } }) => Promise<Response> }
		>;
		state: Record<
			string,
			{ $get: (o: { param: { name: string } }) => Promise<Response> }
		>;
	};
};

async function obtenerConTiempo<T>(
	promise: Promise<T>,
	tiempoMs = 8000,
): Promise<T> {
	let idTiempo: NodeJS.Timeout;
	const promesaTiempo = new Promise<never>((_, reject) => {
		idTiempo = setTimeout(
			() => reject(new Error("Tiempo de espera agotado")),
			tiempoMs,
		);
	});

	return Promise.race([promise, promesaTiempo]).finally(() =>
		clearTimeout(idTiempo),
	);
}

export async function obtenerDatosMapa() {
	try {
		const res = await obtenerConTiempo(client.api.map.$get());
		return (await parsearRespuesta(res, z.array(PresenciaEstadoSchema))) ?? [];
	} catch (error) {
		console.error("Error [obtenerDatosMapa]:", error);
		return [];
	}
}

export async function obtenerDetalleCartel(slug: string) {
	try {
		const res = await obtenerConTiempo(
			client.api.cartel[":slug"].$get({ param: { slug } }),
		);
		return await parsearRespuesta(res, DetalleCartelSchema);
	} catch (error) {
		console.error("Error [obtenerDetalleCartel]:", error);
		return null;
	}
}

export async function obtenerCarteles() {
	try {
		const res = await obtenerConTiempo(client.api.cartels.$get());
		if (!res.ok) return [];
		return (await parsearRespuesta(res, z.array(CartelBasicoSchema))) ?? [];
	} catch (error) {
		console.error("Error [obtenerCarteles]:", error);
		return [];
	}
}

export async function obtenerInteligenciaEstado(nombreEstado: string) {
	try {
		const res = await obtenerConTiempo(
			client.api.state[":name"].$get({ param: { name: nombreEstado } }),
		);
		return await parsearRespuesta(res, InteligenciaEstadoSchema);
	} catch (error) {
		console.error("Error [obtenerInteligenciaEstado]:", error);
		return null;
	}
}
