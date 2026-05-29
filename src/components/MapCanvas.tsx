"use client";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	ZoomableGroup,
} from "react-simple-maps";
import { feature } from "topojson-client";
import { obtenerDatosMapa } from "@/actions/mapData";
import {
	useAccionesMapa,
	useBusqueda,
	useCargandoDatosPresencia,
	useCartelSeleccionado,
	useDatosPresencia,
	useErrorDatosPresencia,
	useEstadoSeleccionado,
} from "@/store/mapStore";

// Recurso TopoJSON con los límites geográficos de México.
const geoUrl = "/maps/mexico.json";

// Constantes de configuración para la proyección y el zoom.
const MEXICO_CENTER: [number, number] = [-102.34, 24.01];
const DEFAULT_ZOOM = 1;
const MAX_ZOOM = 8;
const ZOOM_STEP = 1.5;

interface TooltipState {
	content: string; // Nombre del estado
	cartel: string; // Cárteles presentes
	color: string; // Color representativo
	x: number; // Posición X relativa
	y: number; // Posición Y relativa
}

interface TopoData {
	type: "Topology";
	arcs: unknown[];
	objects: {
		states: unknown;
	};
}

interface CartelStyle {
	fill: string;
	stroke: string;
	strokeWidth: number;
	cartel: string;
	opacity: number;
	liveDataRaw: { color?: string } | null;
}

interface PatronDef {
	id: string;
	colores: string[];
}

function obtenerColoresOrdenados(carteles: Array<{ color: string }>): string[] {
	return carteles.map((c) => c.color).sort();
}

function generarIdPatron(colores: string[]): string {
	return `patron-${colores.map((c) => c.replace("#", "")).join("-")}`;
}

interface MemoizedMapProps {
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
	const [topoData, setTopoData] = useState<TopoData | null>(null);
	const [tooltip, setTooltip] = useState<TooltipState | null>(null);
	const [errorMapa, setErrorMapa] = useState<string | null>(null);
	const [cargandoMapa, setCargandoMapa] = useState(true);

	const mapContainerRef = useRef<HTMLDivElement>(null);

	/** Efecto: Carga asíncrona de geometría (TopoJSON) e inteligencia (DB) con AbortController */
	useEffect(() => {
		const controller = new AbortController();

		// 1. Carga de Geometría
		setCargandoMapa(true);
		fetch(geoUrl, { signal: controller.signal })
			.then((res) => (res.ok ? res.json() : Promise.reject()))
			.then((data) => {
				setTopoData(data);
				setErrorMapa(null);
			})
			.catch(
				(err) => err.name !== "AbortError" && setErrorMapa("Error geometría"),
			)
			.finally(() => setCargandoMapa(false));

		// 2. Carga de Inteligencia en Vivo
		establecerCargandoDatosPresencia(true);
		obtenerDatosMapa()
			.then((data) => {
				establecerDatosPresencia(data);
				establecerErrorDatosPresencia(null);
			})
			.catch(() => establecerErrorDatosPresencia("Error inteligencia"))
			.finally(() => establecerCargandoDatosPresencia(false));

		return () => controller.abort();
	}, [
		establecerDatosPresencia,
		establecerCargandoDatosPresencia,
		establecerErrorDatosPresencia,
	]);

	/** Handlers de control de cámara (Zoom/Reset) */
	const handleZoomIn = useCallback(
		() =>
			setPosition((p) => ({
				...p,
				zoom: Math.min((p.zoom || DEFAULT_ZOOM) * ZOOM_STEP, MAX_ZOOM),
			})),
		[],
	);
	const handleZoomOut = useCallback(
		() =>
			setPosition((p) => ({
				...p,
				zoom: Math.max((p.zoom || DEFAULT_ZOOM) / ZOOM_STEP, DEFAULT_ZOOM),
			})),
		[],
	);
	const handleReset = useCallback(
		() => setPosition({ coordinates: MEXICO_CENTER, zoom: DEFAULT_ZOOM }),
		[],
	);
	const handleClearSelection = useCallback(
		() => establecerEstadoSeleccionado(null),
		[establecerEstadoSeleccionado],
	);

	/** Efecto: Atajos de teclado para navegación táctica (+, -, R, ESC) */
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			)
				return;
			if (["+", "="].includes(e.key)) {
				e.preventDefault();
				handleZoomIn();
			}
			if (["-", "_"].includes(e.key)) {
				e.preventDefault();
				handleZoomOut();
			}
			if (["r", "R", "0"].includes(e.key)) {
				e.preventDefault();
				handleReset();
			}
			if (e.key === "Escape") {
				e.preventDefault();
				handleClearSelection();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleZoomIn, handleZoomOut, handleReset, handleClearSelection]);

	const getCartelStyle = useCallback(
		(nombreEstado: string): CartelStyle => {
			const registro = datosPresencia.find(
				(s) => s.nombre_estado === nombreEstado,
			);

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
			const nombresCarteles = registro.carteles
				.map((c) => c.nombre)
				.join(" / ");

			// Search mode: highlight/dim sin cartel seleccionado
			if (enModoBusqueda) {
				if (registro.carteles.length > 1) {
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
				return {
					fill: coincideBusqueda
						? `${colorPrincipal}dd`
						: `${colorPrincipal}18`,
					stroke: coincideBusqueda ? "white" : `${colorPrincipal}30`,
					strokeWidth: coincideBusqueda ? 2 : 1,
					cartel: nombresCarteles,
					opacity: coincideBusqueda ? 1 : 0.2,
					liveDataRaw: cartelPrincipal,
				};
			}

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
		},
		[cartelSeleccionado, datosPresencia, busqueda],
	);

	// Memoización de features TopoJSON para evitar recálculos costosos
	const features = useMemo(() => {
		if (!topoData?.objects?.states) return [];
		try {
			const result = feature(
				topoData as never,
				topoData.objects.states as never,
			);
			return "features" in result
				? (result as { features: unknown[] }).features
				: [];
		} catch {
			return [];
		}
	}, [topoData]);

	// Escala adaptativa según dispositivo (Mobile/Desktop)
	const mapScale = useMemo(
		() =>
			typeof window !== "undefined" && window.innerWidth < 768 ? 900 : 1400,
		[],
	);

	// Patrones SVG dinámicos para estados con múltiples carteles
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
			{/* HUD: Gestión de errores y carga */}
			{errorMapa && <ErrorDisplay message={errorMapa} />}
			{errorDatosPresencia && <ErrorDisplay message={errorDatosPresencia} />}
			{cargandoMapa && !errorMapa && <LoadingOverlay />}
			{cargandoDatosPresencia && !cargandoMapa && <CargandoDatos />}

			<div
				className="absolute inset-0 flex items-center justify-center bg-surface-alt"
				style={{
					backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
				}}
			>
				{tooltip && <StrategicTooltip tooltip={tooltip} />}

				{!topoData && !errorMapa ? (
					<LoadingIndicator />
				) : (
					topoData && (
						<MemoizedMap
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

				<KeyboardShortcutsHint />
				<MapControls
					onZoomIn={handleZoomIn}
					onZoomOut={handleZoomOut}
					onReset={handleReset}
					zoom={position.zoom}
				/>
			</div>
		</div>
	);
}

// --- Sub-componentes de UI y Renderizado Optimizado ---

const StrategicTooltip = React.memo(
	({ tooltip }: { tooltip: TooltipState }) => (
		<div
			className="absolute z-50 pointer-events-none transition-transform duration-75 ease-out"
			style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
		>
			<div className="bg-tooltip/95 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-2xl flex flex-col gap-1.5 min-w-[180px]">
				<span className="text-[10px] font-black uppercase tracking-widest text-tertiary">
					Estado
				</span>
				<span className="text-sm font-bold text-primary">
					{tooltip.content}
				</span>
				<div className="h-[1px] w-full bg-white/5 my-0.5" />
				<div className="flex items-center gap-2">
					<div
						className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
						style={{ backgroundColor: tooltip.color }}
					/>
					<span
						className="text-xs font-mono font-bold"
						style={{ color: tooltip.color }}
					>
						{tooltip.cartel}
					</span>
				</div>
			</div>
		</div>
	),
);
StrategicTooltip.displayName = "StrategicTooltip";

const LoadingOverlay = () => (
	<div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-40">
		<div className="flex flex-col items-center gap-4">
			<div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
			<span className="text-xs font-mono uppercase tracking-[0.2em] text-secondary">
				Sincronizando...
			</span>
		</div>
	</div>
);

const CargandoDatos = () => (
	<div className="absolute top-4 right-4 z-30">
		<div className="bg-card/80 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
			<div className="w-3 h-3 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
			<span className="text-[10px] font-mono text-secondary">
				Cargando datos...
			</span>
		</div>
	</div>
);

const LoadingIndicator = React.memo(() => (
	<div className="flex flex-col items-center gap-4 text-secondary">
		<div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
		<span className="text-xs font-mono uppercase tracking-[0.2em]">
			Cargando Mapa...
		</span>
	</div>
));
LoadingIndicator.displayName = "LoadingIndicator";

const MapControls = React.memo(
	({
		onZoomIn,
		onZoomOut,
		onReset,
		zoom,
	}: {
		onZoomIn: () => void;
		onZoomOut: () => void;
		onReset: () => void;
		zoom: number;
	}) => (
		<div className="absolute top-20 md:bottom-6 right-3 md:right-6 flex flex-col gap-2 z-20">
			<button
				type="button"
				onClick={onZoomIn}
				disabled={zoom >= MAX_ZOOM}
				className="w-11 h-11 rounded-lg bg-card/80 border border-white/10 hover:bg-hover transition-all disabled:opacity-30 flex items-center justify-center text-lg"
				aria-label="Acercar"
			>
				+
			</button>
			<button
				type="button"
				onClick={onZoomOut}
				disabled={zoom <= DEFAULT_ZOOM}
				className="w-11 h-11 rounded-lg bg-card/80 border border-white/10 hover:bg-hover transition-all disabled:opacity-30 flex items-center justify-center text-lg"
				aria-label="Alejar"
			>
				-
			</button>
			<button
				type="button"
				onClick={onReset}
				className="w-11 h-11 rounded-lg bg-card/80 border border-white/10 text-accent hover:bg-accent/10 transition-all flex items-center justify-center"
				aria-label="Resetear"
			>
				⟲
			</button>
		</div>
	),
);
MapControls.displayName = "MapControls";

const KeyboardShortcutsHint = () => (
	<div className="absolute bottom-6 left-6 z-30 bg-card/60 backdrop-blur-sm border border-white/5 rounded-lg px-3 py-2 text-[10px] font-mono text-tertiary hidden md:block">
		<div className="flex items-center gap-3">
			<span>+ / - : Zoom</span>
			<span>R : Reset</span>
			<span>ESC : Limpiar</span>
		</div>
	</div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
	<div
		role="alert"
		className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50"
	>
		<div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 flex items-center gap-2">
			<span className="text-red-400 text-xs font-mono">⚠️ {message}</span>
			<button
				type="button"
				onClick={() => window.location.reload()}
				className="text-xs text-red-400/70 hover:text-red-400 ml-2 underline"
			>
				Reintentar
			</button>
		</div>
	</div>
);

/**
 * Renderizador SVG memoizado. Evita re-renders masivos durante interacciones de mouse o UI externa.
 */
const MemoizedMap = React.memo(
	({
		features,
		position,
		handleMoveEnd,
		getCartelStyle,
		selectedState,
		setSelectedState,
		setTooltip,
		mapScale,
		containerRef,
		patronesDefs,
	}: MemoizedMapProps) => {
		const handleMouseEnter = useCallback(
			(
				e: React.MouseEvent | React.TouchEvent,
				nombreEstado: string,
				style: CartelStyle,
			) => {
				if (!containerRef.current) return;
				const rect = containerRef.current.getBoundingClientRect();
				const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
				const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
				setTooltip({
					content: nombreEstado,
					cartel: style.cartel,
					color:
						style.stroke === "white"
							? (style.liveDataRaw?.color ?? "#8b98b8")
							: style.stroke,
					x: clientX - rect.left,
					y: clientY - rect.top,
				});
			},
			[containerRef, setTooltip],
		);

		const handleMouseMove = useCallback(
			(e: React.MouseEvent | React.TouchEvent) => {
				if (!containerRef.current) return;
				const rect = containerRef.current.getBoundingClientRect();
				const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
				const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
				setTooltip((prev) =>
					prev
						? { ...prev, x: clientX - rect.left, y: clientY - rect.top }
						: null,
				);
			},
			[containerRef, setTooltip],
		);

		return (
			<div className="absolute inset-0 z-10">
				<ComposableMap
					projection="geoMercator"
					projectionConfig={{ scale: mapScale, center: MEXICO_CENTER }}
					className="w-full h-full"
					role="img"
					aria-label="Mapa de México con control territorial de cárteles"
				>
					<defs>
						{patronesDefs.map((p) => {
							const anchoFranja = 12 / p.colores.length;
							return (
								<pattern
									key={p.id}
									id={p.id}
									width="12"
									height="12"
									patternUnits="userSpaceOnUse"
									patternTransform="rotate(45)"
								>
									{p.colores.map((color, i) => (
										<rect
											key={color}
											x={i * anchoFranja}
											width={anchoFranja}
											height="12"
											fill={color}
											fillOpacity={0.5}
										/>
									))}
								</pattern>
							);
						})}
					</defs>

					<ZoomableGroup
						zoom={position.zoom}
						center={position.coordinates}
						onMoveEnd={handleMoveEnd}
						maxZoom={MAX_ZOOM}
					>
						<Geographies geography={features}>
							{({ geographies }) =>
								geographies.map((geo) => {
									const nombreEstado = geo.properties.state_name;
									const style = getCartelStyle(nombreEstado);
									return (
										<Geography
											key={geo.rsmKey}
											geography={geo}
											fill={style.fill}
											stroke={style.stroke}
											strokeWidth={style.strokeWidth}
											tabIndex={0}
											role="button"
											aria-label={nombreEstado}
											onMouseEnter={(e) =>
												handleMouseEnter(e, nombreEstado, style)
											}
											onMouseMove={handleMouseMove}
											onMouseLeave={() => setTooltip(null)}
											onTouchStart={(e) =>
												handleMouseEnter(e, nombreEstado, style)
											}
											onTouchMove={handleMouseMove}
											onTouchEnd={() =>
												setTimeout(() => setTooltip(null), 1500)
											}
											onClick={() =>
												setSelectedState(
													selectedState === nombreEstado ? null : nombreEstado,
												)
											}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													setSelectedState(
														selectedState === nombreEstado
															? null
															: nombreEstado,
													);
												}
											}}
											style={{
												default: {
													opacity: style.opacity,
													outline: "none",
													transition: "all 200ms ease",
												},
												hover: {
													fillOpacity: 0.8,
													stroke: "white",
													strokeWidth: 2,
												},
												pressed: {
													fillOpacity: 0.6,
													stroke: "white",
													strokeWidth: 3,
												},
											}}
											className="focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
										/>
									);
								})
							}
						</Geographies>
					</ZoomableGroup>
				</ComposableMap>
			</div>
		);
	},
);

MemoizedMap.displayName = "MemoizedMap";
