"use client";

import type { FeatureCollection } from "geojson";
// React y hooks
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// TopoJSON y GeoJSON
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
// Server actions
import { obtenerDatosMapa } from "@/actions/mapData";
// Utilerías y cálculos de estilo del mapa
import {
	calcularEstiloCartel,
	generarIdPatron,
	obtenerColoresOrdenados,
} from "@/lib/mapa";
// Store (Zustand)
import {
	useAccionesMapa,
	useBusqueda,
	useCargandoDatosPresencia,
	useCartelSeleccionado,
	useDatosPresencia,
	useErrorDatosPresencia,
	useEstadoSeleccionado,
} from "@/store/mapStore";
import type { PatronDef, TooltipState } from "@/types/mapa";
import {
	CargandoInicial,
	CargandoMapaCompleto,
	IndicadorCargaDatos,
	MensajeError,
} from "./EstadosCarga";
import MapaControles, { IndicadorAtajos } from "./MapaControles";
import MapaRenderizado from "./MapaRenderizado";
import TooltipEstrategico from "./TooltipEstrategico";

// Recurso TopoJSON con los límites geográficos de México.
const geoUrl = "https://mxwatch-assets.mgdc.site/maps/mexico.json";

// Constantes de configuración para la proyección y el zoom.
const MEXICO_CENTER: [number, number] = [-102.34, 24.01];
const DEFAULT_ZOOM = 1;
const MAX_ZOOM = 8;
const ZOOM_STEP = 1.5;

/**
 * Núcleo interactivo del mapa: renderiza geografía, gestiona zoom y visualiza control territorial.
 */
export default function MapCanvas() {
	// Estado Global (Zustand)
	const cartelSeleccionado = useCartelSeleccionado();
	const estadoSeleccionado = useEstadoSeleccionado();
	const datosPresencia = useDatosPresencia();
	const busqueda = useBusqueda();
	const {
		establecerEstadoSeleccionado,
		establecerDatosPresencia,
		establecerCargandoDatosPresencia,
		establecerErrorDatosPresencia,
	} = useAccionesMapa();
	const cargandoDatosPresencia = useCargandoDatosPresencia();
	const errorDatosPresencia = useErrorDatosPresencia();

	// Estado Local: Vista, datos crudos y UI
	const [position, setPosition] = useState({
		coordinates: MEXICO_CENTER,
		zoom: DEFAULT_ZOOM,
	});
	const [topoData, setTopoData] = useState<Topology | null>(null);
	const [tooltip, setTooltip] = useState<TooltipState | null>(null);
	const [errorMapa, setErrorMapa] = useState<string | null>(null);
	const [cargandoMapa, setCargandoMapa] = useState(true);

	// Referencia al contenedor del mapa para cálculos de posición
	const mapContainerRef = useRef<HTMLDivElement>(null);

	// Carga asíncrona de geometría (TopoJSON) e inteligencia (DB) con AbortController
	useEffect(() => {
		const controller = new AbortController();

		// 1. Carga de Geometría
		setCargandoMapa(true);
		fetch(geoUrl, { signal: controller.signal })
			// Valida que la respuesta HTTP sea exitosa
			.then((res) => (res.ok ? res.json() : Promise.reject()))
			// Almacena la geometría descargada
			.then((data) => {
				setTopoData(data);
				setErrorMapa(null);
			})
			// Ignora errores por aborto controlado
			.catch((err: unknown) => {
				if (err instanceof DOMException && err.name === "AbortError") return;
				setErrorMapa("Error geometría");
			})
			// Quita el indicador de carga
			.finally(() => setCargandoMapa(false));

		// 2. Carga de Inteligencia en Vivo
		establecerCargandoDatosPresencia(true);
		obtenerDatosMapa()
			// Almacena los datos de presencia
			.then((data) => {
				establecerDatosPresencia(data);
				establecerErrorDatosPresencia(null);
			})
			// Error de conexión con el servidor
			.catch(() => establecerErrorDatosPresencia("Error inteligencia"))
			// Quita el indicador de carga
			.finally(() => establecerCargandoDatosPresencia(false));

		return () => controller.abort();
	}, [
		establecerDatosPresencia,
		establecerCargandoDatosPresencia,
		establecerErrorDatosPresencia,
	]);

	// Handlers de control de cámara (Zoom/Reset)
	// Acerca el mapa (zoom in)
	const handleZoomIn = useCallback(
		() =>
			setPosition((p) => ({
				...p,
				zoom: Math.min((p.zoom || DEFAULT_ZOOM) * ZOOM_STEP, MAX_ZOOM),
			})),
		[],
	);
	// Aleja el mapa (zoom out)
	const handleZoomOut = useCallback(
		() =>
			setPosition((p) => ({
				...p,
				zoom: Math.max((p.zoom || DEFAULT_ZOOM) / ZOOM_STEP, DEFAULT_ZOOM),
			})),
		[],
	);
	// Restaura posición y zoom inicial
	const handleReset = useCallback(
		() => setPosition({ coordinates: MEXICO_CENTER, zoom: DEFAULT_ZOOM }),
		[],
	);
	// Limpia la selección de estado
	const handleClearSelection = useCallback(
		() => establecerEstadoSeleccionado(null),
		[establecerEstadoSeleccionado],
	);

	// Atajos de teclado para navegación táctica (+, -, R, ESC)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ignora eventos si el foco está en un input
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			)
				return;
			// + = Acercar
			if (["+", "="].includes(e.key)) {
				e.preventDefault();
				handleZoomIn();
			}
			// - = Alejar
			if (["-", "_"].includes(e.key)) {
				e.preventDefault();
				handleZoomOut();
			}
			// R / 0 = Reset
			if (["r", "R", "0"].includes(e.key)) {
				e.preventDefault();
				handleReset();
			}
			// ESC = Limpiar selección
			if (e.key === "Escape") {
				e.preventDefault();
				handleClearSelection();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleZoomIn, handleZoomOut, handleReset, handleClearSelection]);

	// Calcula el estilo visual de un estado según datos de presencia y selección
	const getCartelStyle = useCallback(
		(nombreEstado: string) =>
			calcularEstiloCartel(
				nombreEstado,
				datosPresencia,
				cartelSeleccionado,
				busqueda,
			),
		[cartelSeleccionado, datosPresencia, busqueda],
	);

	// Convierte TopoJSON a GeoJSON para react-simple-maps
	const features = useMemo(() => {
		if (!topoData?.objects?.states) return [];
		try {
			const result = feature(
				topoData,
				"states",
			) as unknown as FeatureCollection;
			return result.features;
		} catch {
			// Si falla la conversión, features queda vacío
			return [];
		}
	}, [topoData]);

	// Escala adaptativa según dispositivo (Mobile/Desktop)
	const mapScale = useMemo(
		() =>
			typeof window !== "undefined" && window.innerWidth < 768 ? 900 : 1400,
		[],
	);

	// Agrupa combinaciones únicas de colores para patrones SVG
	const patronesDefs = useMemo<PatronDef[]>(() => {
		const unicas = new Map<string, string[]>();
		for (const estado of datosPresencia) {
			if (estado.carteles.length > 1) {
				const colores = obtenerColoresOrdenados(estado.carteles);
				const key = colores.join(",");
				if (!unicas.has(key)) {
					unicas.set(key, colores);
				}
			}
		}
		// Genera un pattern SVG por cada combinación única
		return Array.from(unicas.entries()).map(([_, colores]) => ({
			id: generarIdPatron(colores),
			colores,
		}));
	}, [datosPresencia]);

	return (
		<div
			ref={mapContainerRef}
			className="relative flex-1 w-full h-full bg-surface overflow-hidden cursor-crosshair touch-manipulation"
		>
			{/* Errores y estados de carga */}
			{errorMapa && <MensajeError message={errorMapa} />}
			{errorDatosPresencia && <MensajeError message={errorDatosPresencia} />}
			{cargandoMapa && !errorMapa && <CargandoMapaCompleto />}
			{cargandoDatosPresencia && !cargandoMapa && <IndicadorCargaDatos />}

			<div
				className="absolute inset-0 flex items-center justify-center bg-surface-alt"
				style={{
					backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
				}}
			>
				{/* Tooltip flotante al hacer hover */}
				{tooltip && <TooltipEstrategico tooltip={tooltip} />}

				{/* Mapa o pantalla de carga */}
				{!topoData && !errorMapa ? (
					<CargandoInicial />
				) : (
					topoData && (
						<MapaRenderizado
							features={features}
							position={position}
							handleMoveEnd={setPosition}
							getCartelStyle={getCartelStyle}
							selectedState={estadoSeleccionado}
							setSelectedState={establecerEstadoSeleccionado}
							setTooltip={setTooltip}
							mapScale={mapScale}
							containerRef={mapContainerRef}
							patronesDefs={patronesDefs}
						/>
					)
				)}

				{/* Controles de zoom y atajos */}
				<IndicadorAtajos />
				<MapaControles
					onZoomIn={handleZoomIn}
					onZoomOut={handleZoomOut}
					onReset={handleReset}
					zoom={position.zoom}
				/>
			</div>
		</div>
	);
}
