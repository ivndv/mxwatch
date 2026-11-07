import type { PresenciaEstado } from "@/schemas/api";
import type { CartelStyle } from "@/types/mapa";

// Estilo para estados sin datos de presencia (los colores cambian con el tema)
export const ESTILO_SIN_DATOS: CartelStyle = {
	fill: "var(--map-empty-fill)",
	stroke: "var(--map-empty-stroke)",
	strokeWidth: 0.5,
	cartel: "Sin datos",
	opacity: 1,
	liveDataRaw: null,
};

// Normaliza texto para buscar sin acentos ni mayúsculas
export function normalizarTexto(texto: string): string {
	return texto
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

export type ModoBusqueda = "estado" | "cartel" | null;

export interface BusquedaMapa {
	modo: ModoBusqueda;
	consulta: string;
	estados: PresenciaEstado[];
}

// Clasifica la búsqueda: los estados tienen prioridad sobre los cárteles
export function clasificarBusqueda(
	datosPresencia: PresenciaEstado[],
	consulta: string,
): BusquedaMapa {
	const q = normalizarTexto(consulta.trim());
	if (!q) return { modo: null, consulta: "", estados: [] };

	const porEstado = datosPresencia.filter((estado) =>
		normalizarTexto(estado.nombre_estado).includes(q),
	);
	if (porEstado.length > 0) {
		return { modo: "estado", consulta: q, estados: porEstado };
	}

	const porCartel = datosPresencia.filter((estado) =>
		estado.carteles.some(
			(cartel) =>
				normalizarTexto(cartel.nombre).includes(q) ||
				normalizarTexto(cartel.slug).includes(q),
		),
	);
	return { modo: "cartel", consulta: q, estados: porCartel };
}

// Ordena los colores de los cárteles alfabéticamente para generar patrones consistentes
export function obtenerColoresOrdenados(
	carteles: Array<{ color: string }>,
): string[] {
	return carteles.map((c) => c.color).sort();
}

// Genera un ID único para el patrón SVG basado en los colores
export function generarIdPatron(colores: string[]): string {
	return `patron-${colores.map((c) => c.replace("#", "")).join("-")}`;
}

// Calcula el estilo visual de un estado según datos de presencia y selección
export function calcularEstiloCartel(
	nombreEstado: string,
	registro: PresenciaEstado | undefined,
	cartelSeleccionado: string | null,
	modoBusqueda: ModoBusqueda,
	consulta: string,
): CartelStyle {
	// Estado sin datos: color neutro
	if (!registro || registro.carteles.length === 0) {
		return ESTILO_SIN_DATOS;
	}

	// Variables de selección y búsqueda
	const hayCoincidencia =
		cartelSeleccionado &&
		registro.carteles.some(
			(c) => c.slug === cartelSeleccionado || c.id === cartelSeleccionado,
		);
	const estaAtenuado = cartelSeleccionado && !hayCoincidencia;
	const enModoBusqueda = modoBusqueda !== null && !cartelSeleccionado;
	const coincideBusqueda =
		enModoBusqueda &&
		(modoBusqueda === "estado"
			? normalizarTexto(nombreEstado).includes(consulta)
			: registro.carteles.some(
					(c) =>
						normalizarTexto(c.nombre).includes(consulta) ||
						normalizarTexto(c.slug).includes(consulta),
				));
	const cartelPrincipal = registro.carteles[0];
	const colorPrincipal = cartelPrincipal.color;
	const nombresCarteles = registro.carteles.map((c) => c.nombre).join(" / ");

	// Modo búsqueda: resalta el estado si coincide, lo atenúa si no
	if (enModoBusqueda) {
		if (registro.carteles.length > 1) {
			// Múltiples cárteles: patrón de rayas con colores ordenados
			const colores = obtenerColoresOrdenados(registro.carteles);
			const idPatron = generarIdPatron(colores);
			return {
				fill: `url(#${idPatron})`,
				stroke: coincideBusqueda
					? "var(--map-highlight)"
					: `${colorPrincipal}30`,
				strokeWidth: coincideBusqueda ? 2 : 1,
				cartel: nombresCarteles,
				opacity: coincideBusqueda ? 1 : 0.2,
				liveDataRaw: cartelPrincipal,
			};
		}
		// Un solo cártel: color sólido
		return {
			fill: coincideBusqueda ? `${colorPrincipal}dd` : `${colorPrincipal}18`,
			stroke: coincideBusqueda ? "var(--map-highlight)" : `${colorPrincipal}30`,
			strokeWidth: coincideBusqueda ? 2 : 1,
			cartel: nombresCarteles,
			opacity: coincideBusqueda ? 1 : 0.2,
			liveDataRaw: cartelPrincipal,
		};
	}

	// Sin búsqueda con múltiples cárteles: patrón de rayas
	if (registro.carteles.length > 1) {
		const colores = obtenerColoresOrdenados(registro.carteles);
		const idPatron = generarIdPatron(colores);

		return {
			fill: `url(#${idPatron})`,
			stroke: estaAtenuado
				? `${colorPrincipal}30`
				: hayCoincidencia
					? "var(--map-highlight)"
					: colorPrincipal,
			strokeWidth: hayCoincidencia ? 2 : 1,
			cartel: nombresCarteles,
			opacity: estaAtenuado ? 0.2 : hayCoincidencia ? 1 : 0.5,
			liveDataRaw: cartelPrincipal,
		};
	}

	// Sin búsqueda con un solo cártel: color sólido
	return {
		fill: estaAtenuado
			? `${colorPrincipal}18`
			: hayCoincidencia
				? `${colorPrincipal}dd`
				: `${colorPrincipal}44`,
		stroke: estaAtenuado
			? `${colorPrincipal}30`
			: hayCoincidencia
				? "var(--map-highlight)"
				: colorPrincipal,
		strokeWidth: hayCoincidencia ? 2 : 1,
		cartel: nombresCarteles,
		opacity: estaAtenuado ? 0.4 : 1,
		liveDataRaw: cartelPrincipal,
	};
}
