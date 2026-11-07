import { z } from "zod";

// Contenedor estándar para respuestas exitosas de la API
const ExitoRespuestaSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		exito: z.literal(true),
		datos: dataSchema,
		marca_tiempo: z.iso.datetime().optional(),
		conteo: z.number().optional(),
	});

// Parsea y valida respuestas HTTP de mxwatch-api contra esquemas de Zod
export async function parsearRespuesta<T>(
	res: Response,
	schema: z.ZodType<T>,
): Promise<T | null> {
	// Un 404 significa "sin datos", no un fallo de la API
	if (res.status === 404) return null;

	// Cualquier otro error HTTP se propaga para que TanStack lo maneje
	if (!res.ok) throw new Error(`mxwatch-api respondió ${res.status}`);

	const json = await res.json();
	const parsed = ExitoRespuestaSchema(schema).safeParse(json);

	if (!parsed.success) {
		console.error("Error de validación API:", parsed.error.issues);
		throw new Error("Respuesta inválida de mxwatch-api");
	}

	return parsed.data.datos;
}
