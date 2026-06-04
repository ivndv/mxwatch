import type { PresenciaEstado } from "@/schemas/api.schemas";

// Estado del tooltip al hacer hover sobre un estado
export interface TooltipState {
	content: string;
	cartel: string;
	color: string;
	x: number;
	y: number;
}

// Estilo visual de cada estado en el mapa
export interface CartelStyle {
	fill: string;
	stroke: string;
	strokeWidth: number;
	cartel: string;
	opacity: number;
	liveDataRaw: { color?: string } | null;
}

// Patrón SVG para estados con múltiples cárteles
export interface PatronDef {
	id: string;
	colores: string[];
}

// Props del sub-componente MapaRenderizado
export interface MapaMemoizadoProps {
	features: unknown[];
	position: { coordinates: [number, number]; zoom: number };
	handleMoveEnd: (position: {
		coordinates: [number, number];
		zoom: number;
	}) => void;
	getCartelStyle: (nombreEstado: string) => CartelStyle;
	selectedState: string | null;
	setSelectedState: (state: string | null) => void;
	setTooltip: React.Dispatch<React.SetStateAction<TooltipState | null>>;
	mapScale: number;
	containerRef: React.RefObject<HTMLDivElement | null>;
	patronesDefs: PatronDef[];
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
	datosPresencia: PresenciaEstado[],
	cartelSeleccionado: string | null,
	busqueda: string,
): CartelStyle {
	// Busca el registro de presencia para este estado
	const registro = datosPresencia.find((s) => s.nombre_estado === nombreEstado);

	// Estado sin datos: color neutro
	if (!registro || registro.carteles.length === 0) {
		return {
			fill: "rgba(25, 40, 60, 0.4)",
			stroke: "rgba(80, 110, 150, 0.4)",
			strokeWidth: 0.5,
			cartel: "Sin datos",
			opacity: 1,
			liveDataRaw: null,
		};
	}

	// Variables de selección y búsqueda
	const hayCoincidencia =
		cartelSeleccionado &&
		registro.carteles.some(
			(c) => c.slug === cartelSeleccionado || c.id === cartelSeleccionado,
		);
	const estaAtenuado = cartelSeleccionado && !hayCoincidencia;
	const enModoBusqueda = !!busqueda && !cartelSeleccionado;
	const coincideBusqueda =
		enModoBusqueda &&
		(nombreEstado.toLowerCase().includes(busqueda.toLowerCase()) ||
			registro.carteles.some(
				(c) =>
					c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
					c.slug.toLowerCase().includes(busqueda.toLowerCase()),
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
				stroke: coincideBusqueda ? "white" : `${colorPrincipal}30`,
				strokeWidth: coincideBusqueda ? 2 : 1,
				cartel: nombresCarteles,
				opacity: coincideBusqueda ? 1 : 0.2,
				liveDataRaw: cartelPrincipal,
			};
		}
		// Un solo cártel: color sólido
		return {
			fill: coincideBusqueda ? `${colorPrincipal}dd` : `${colorPrincipal}18`,
			stroke: coincideBusqueda ? "white" : `${colorPrincipal}30`,
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
					? "white"
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
				? "white"
				: colorPrincipal,
		strokeWidth: hayCoincidencia ? 2 : 1,
		cartel: nombresCarteles,
		opacity: estaAtenuado ? 0.4 : 1,
		liveDataRaw: cartelPrincipal,
	};
}
