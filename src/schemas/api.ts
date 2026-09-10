import { z } from "zod";

// Esquemas de validación Zod para las respuestas de mxwatch-api

export const CartelBasicoSchema = z.object({
	id: z.string().uuid(),
	nombre: z.string(),
	slug: z.string(),
	color: z.string(),
});

export const PresenciaEstadoSchema = z.object({
	slug_estado: z.string(),
	nombre_estado: z.string(),
	carteles: z.array(
		z.object({
			id: z.string().uuid(),
			nombre: z.string(),
			color: z.string(),
			slug: z.string(),
		}),
	),
});

export const FaccionSchema = z.object({
	id: z.string().uuid().optional(),
	nombre: z.string(),
	enfoque: z.string().nullable(),
});

export const PersonaSchema = z.object({
	id: z.string().uuid().optional(),
	nombre: z.string(),
	alias: z.string().nullable(),
});

export const BrazoArmadoSchema = z.object({
	id: z.string().uuid().optional(),
	nombre: z.string(),
});

export const DetalleCartelSchema = z.object({
	id: z.string().uuid(),
	nombre: z.string(),
	slug: z.string(),
	color: z.string(),
	presencia: z.object({
		estados: z.array(z.object({ nombre_estado: z.string() })),
		total_estados: z.number(),
	}),
	facciones: z.array(FaccionSchema),
	personas: z.array(PersonaSchema),
	brazos_armados: z.array(BrazoArmadoSchema),
});

export const InteligenciaEstadoSchema = z.object({
	nombre_estado: z.string(),
	slug_estado: z.string(),
	total_carteles: z.number(),
	carteles: z.array(
		z.object({
			id: z.string().uuid(),
			nombre: z.string(),
			slug: z.string(),
			color: z.string(),
			jefes: z.array(PersonaSchema),
			facciones: z.array(FaccionSchema),
			personas: z.array(PersonaSchema),
			brazos_armados: z.array(BrazoArmadoSchema),
		}),
	),
});

// Tipos inferidos de los esquemas Zod
export type PresenciaEstado = z.infer<typeof PresenciaEstadoSchema>;
export type DetalleCartel = z.infer<typeof DetalleCartelSchema>;
export type InteligenciaEstado = z.infer<typeof InteligenciaEstadoSchema>;
export type CartelBasico = z.infer<typeof CartelBasicoSchema>;
export type Faccion = z.infer<typeof FaccionSchema>;
export type Persona = z.infer<typeof PersonaSchema>;
export type BrazoArmado = z.infer<typeof BrazoArmadoSchema>;
