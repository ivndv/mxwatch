"use client";

import type { FeatureCollection } from "geojson";
// React y hooks
import {
	useCallback,
	useDeferredValue,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
// TopoJSON y GeoJSON
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
// Utilerías y cálculos de estilo del mapa
import {
	calcularEstiloCartel,
	clasificarBusqueda,
	ESTILO_SIN_DATOS,
	generarIdPatron,
	obtenerColoresOrdenados,
} from "@/lib/mapa";
// Estado del servidor (TanStack Query)
import { usePresencia } from "@/lib/useMapaQueries";
// Pan/zoom nativo del mapa
import { useMapView } from "@/lib/useMapView";
// Store de UI (Zustand)
import {
	useAccionesMapa,
	useBusqueda,
	useCartelSeleccionado,
	useEstadoSeleccionado,
} from "@/store/mapStore";
import type { CartelStyle, PatronDef, TooltipState } from "@/types/mapa";
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
const geoUrl = "https://assets.liuma.app/mxwatch/maps/mexico.json";

/**
 * Núcleo interactivo del mapa: renderiza geografía, gestiona zoom y visualiza control territorial.
 */
export default function MapCanvas() {
	// Estado de UI (Zustand)
	const cartelSeleccionado = useCartelSeleccionado();
	const estadoSeleccionado = useEstadoSeleccionado();
	const busqueda = useBusqueda();
	const busquedaDiferida = useDeferredValue(busqueda);
	const {
		establecerBusqueda,
		establecerCartelSeleccionado,
		establecerEstadoSeleccionado,
	} = useAccionesMapa();

	// Estado del servidor (TanStack Query)
	const {
		data: datosPresencia = [],
		isLoading: cargandoDatosPresencia,
		error: errorPresencia,
	} = usePresencia();
	const errorDatosPresencia = errorPresencia ? "Error inteligencia" : null;

	// Estado Local: Vista, datos crudos y UI
	const [topoData, setTopoData] = useState<Topology | null>(null);
	const [tooltip, setTooltip] = useState<TooltipState | null>(null);
	const [errorMapa, setErrorMapa] = useState<string | null>(null);
	const [cargandoMapa, setCargandoMapa] = useState(true);

	// Referencia al contenedor del mapa para cálculos de posición
	const mapContainerRef = useRef<HTMLDivElement>(null);
	// Vista (pan/zoom) y manejadores de interacción
	const { view, zoomIn, zoomOut, reset, didDragRef, svgRef, onPointerDown } =
		useMapView();

	// Carga asíncrona de la geometría (TopoJSON) con AbortController
	useEffect(() => {
		const controller = new AbortController();

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

		return () => controller.abort();
	}, []);

	// Selecciona un estado y limpia la búsqueda y el cártel activo
	const seleccionarEstado = useCallback(
		(nombreEstado: string | null) => {
			establecerEstadoSeleccionado(nombreEstado);
			if (nombreEstado) {
				establecerCartelSeleccionado(null);
				establecerBusqueda("");
			}
		},
		[
			establecerEstadoSeleccionado,
			establecerCartelSeleccionado,
			establecerBusqueda,
		],
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
				zoomIn();
			}
			// - = Alejar
			if (["-", "_"].includes(e.key)) {
				e.preventDefault();
				zoomOut();
			}
			// R / 0 = Reset
			if (["r", "R", "0"].includes(e.key)) {
				e.preventDefault();
				reset();
			}
			// ESC = Limpiar selección
			if (e.key === "Escape") {
				e.preventDefault();
				handleClearSelection();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [zoomIn, zoomOut, reset, handleClearSelection]);

	// Clasifica la búsqueda: estados primero, cárteles después
	const busquedaClasificada = useMemo(
		() => clasificarBusqueda(datosPresencia, busquedaDiferida),
		[datosPresencia, busquedaDiferida],
	);

	// Estilos por estado precargados (lookup O(1) en el render)
	const estilosPorEstado = useMemo(() => {
		const mapa = new Map<string, CartelStyle>();
		for (const estado of datosPresencia) {
			mapa.set(
				estado.nombre_estado,
				calcularEstiloCartel(
					estado.nombre_estado,
					estado,
					cartelSeleccionado,
					busquedaClasificada.modo,
					busquedaClasificada.consulta,
				),
			);
		}
		return mapa;
	}, [datosPresencia, cartelSeleccionado, busquedaClasificada]);

	// Estilo de un estado por nombre
	const getCartelStyle = useCallback(
		(nombreEstado: string) =>
			estilosPorEstado.get(nombreEstado) ?? ESTILO_SIN_DATOS,
		[estilosPorEstado],
	);

	// TopoJSON → GeoJSON para el render
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
	const [mapScale, setMapScale] = useState(() =>
		typeof window !== "undefined" &&
		window.matchMedia("(max-width: 767px)").matches
			? 900
			: 1400,
	);
	const [esMovil, setEsMovil] = useState(
		() =>
			typeof window !== "undefined" &&
			window.matchMedia("(max-width: 767px)").matches,
	);

	useEffect(() => {
		const mq = window.matchMedia("(max-width: 767px)");
		const actualizar = () => {
			setMapScale(mq.matches ? 900 : 1400);
			setEsMovil(mq.matches);
		};

		actualizar();
		mq.addEventListener("change", actualizar);
		return () => mq.removeEventListener("change", actualizar);
	}, []);

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
					backgroundImage: `radial-gradient(circle, var(--map-dots) 1px, transparent 1px)`,
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
							view={view}
							svgRef={svgRef}
							didDragRef={didDragRef}
							onPointerDown={onPointerDown}
							getCartelStyle={getCartelStyle}
							selectedState={estadoSeleccionado}
							onSelectState={seleccionarEstado}
							setTooltip={setTooltip}
							mapScale={mapScale}
							preserveAspectRatio={esMovil ? "xMidYMid slice" : "xMidYMid meet"}
							containerRef={mapContainerRef}
							patronesDefs={patronesDefs}
						/>
					)
				)}

				{/* Controles de zoom y atajos */}
				<IndicadorAtajos />
				<MapaControles
					onZoomIn={zoomIn}
					onZoomOut={zoomOut}
					onReset={reset}
					zoom={view.k}
				/>
			</div>
		</div>
	);
}
