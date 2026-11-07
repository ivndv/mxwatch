import { Mercator } from "@visx/geo";
import type { Feature, Geometry } from "geojson";
import React, { useCallback, useEffect, useRef } from "react";
import { MAP_VIEW_HEIGHT, MAP_VIEW_WIDTH } from "@/lib/useMapView";
import type {
	CartelStyle,
	MapaMemoizadoProps,
	PatronDef,
	TooltipState,
} from "@/types/mapa";

const MEXICO_CENTER: [number, number] = [-102.34, 24.01];
const VIEW_TRANSLATE: [number, number] = [
	MAP_VIEW_WIDTH / 2,
	MAP_VIEW_HEIGHT / 2,
];

type EstadoFeature = Feature<Geometry>;

// Patrones SVG memoizados; fuera del <g> para no escalar con el zoom
const MapPatterns = React.memo(function MapPatterns({
	patronesDefs,
}: {
	patronesDefs: PatronDef[];
}) {
	return (
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
	);
});

// Capa geográfica memoizada: en pan/zoom solo cambia el transform del <g>, así
// no re-proyecta (visx) ni re-diffea los paths
const MapaLayer = React.memo(function MapaLayer({
	features,
	getCartelStyle,
	selectedState,
	onSelectState,
	setTooltip,
	didDragRef,
	mapScale,
	containerRef,
}: {
	features: Feature<Geometry>[];
	getCartelStyle: (nombreEstado: string) => CartelStyle;
	selectedState: string | null;
	onSelectState: (state: string | null) => void;
	setTooltip: React.Dispatch<React.SetStateAction<TooltipState | null>>;
	didDragRef: { current: boolean };
	mapScale: number;
	containerRef: React.RefObject<HTMLDivElement | null>;
}) {
	// Rect del contenedor cacheado mientras el hover está activo
	const rectRef = useRef<DOMRect | null>(null);
	// Frame pendiente para mover el tooltip como máximo una vez por frame
	const moveRafRef = useRef<number | null>(null);
	const pendingMoveRef = useRef<{ x: number; y: number } | null>(null);

	useEffect(
		() => () => {
			if (moveRafRef.current != null) cancelAnimationFrame(moveRafRef.current);
		},
		[],
	);

	// Tooltip al hover (se omite al arrastrar)
	const handleMouseEnter = useCallback(
		(
			e: React.MouseEvent | React.TouchEvent,
			nombreEstado: string,
			style: CartelStyle,
		) => {
			if (didDragRef.current || !containerRef.current) return;
			// Cachea el rect del contenedor para no medirlo en cada mousemove
			rectRef.current = containerRef.current.getBoundingClientRect();
			const rect = rectRef.current;
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			setTooltip({
				content: nombreEstado,
				cartel: style.cartel,
				// Color: stroke o fallback si es el resaltado neutro del tema
				color:
					style.stroke === "var(--map-highlight)"
						? (style.liveDataRaw?.color ?? "var(--text-dim)")
						: style.stroke,
				x: clientX - rect.left,
				y: clientY - rect.top,
			});
		},
		[containerRef, setTooltip, didDragRef],
	);

	// Actualiza la posición del tooltip como máximo una vez por frame
	const handleMouseMove = useCallback(
		(e: React.MouseEvent | React.TouchEvent) => {
			if (didDragRef.current || !containerRef.current) return;
			const rect =
				rectRef.current ?? containerRef.current.getBoundingClientRect();
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			pendingMoveRef.current = {
				x: clientX - rect.left,
				y: clientY - rect.top,
			};

			if (moveRafRef.current == null) {
				moveRafRef.current = requestAnimationFrame(() => {
					moveRafRef.current = null;
					const pendiente = pendingMoveRef.current;
					if (!pendiente) return;
					// Conserva el contenido; solo mueve la posición
					setTooltip((prev) =>
						prev ? { ...prev, x: pendiente.x, y: pendiente.y } : null,
					);
				});
			}
		},
		[containerRef, setTooltip, didDragRef],
	);

	// Limpia el rect cacheado y el tooltip al salir
	const handleMouseLeave = useCallback(() => {
		rectRef.current = null;
		pendingMoveRef.current = null;
		setTooltip(null);
	}, [setTooltip]);

	// Alterna la selección (se omite si fue arrastre)
	const handleSelect = useCallback(
		(nombreEstado: string) => {
			if (didDragRef.current) return;
			onSelectState(selectedState === nombreEstado ? null : nombreEstado);
		},
		[didDragRef, selectedState, onSelectState],
	);

	return (
		<Mercator<EstadoFeature>
			data={features}
			center={MEXICO_CENTER}
			translate={VIEW_TRANSLATE}
			scale={mapScale}
		>
			{({ features: geos }) => {
				const seleccionado = selectedState
					? geos.find(
							({ feature }) =>
								(feature.properties?.state_name as string | undefined) ===
								selectedState,
						)
					: undefined;

				return (
					<>
						{geos.map(({ feature, path, index }) => {
							const nombreEstado =
								(feature.properties?.state_name as string | undefined) ?? "";
							const style = getCartelStyle(nombreEstado);
							return (
								<path
									key={`geo-${index}`}
									d={path ?? ""}
									fill={style.fill}
									stroke={style.stroke}
									strokeWidth={style.strokeWidth}
									tabIndex={0}
									role="button"
									aria-label={nombreEstado}
									onMouseEnter={(e) => handleMouseEnter(e, nombreEstado, style)}
									onMouseMove={handleMouseMove}
									// Oculta el tooltip al salir
									onMouseLeave={handleMouseLeave}
									onTouchStart={(e) => handleMouseEnter(e, nombreEstado, style)}
									onTouchMove={handleMouseMove}
									// Oculta el tooltip 1.5s tras soltar el toque
									onTouchEnd={() => setTimeout(() => setTooltip(null), 1500)}
									// Selecciona al hacer clic
									onClick={() => handleSelect(nombreEstado)}
									// Selecciona con Enter o Espacio (a11y)
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											handleSelect(nombreEstado);
										}
									}}
									style={{
										opacity: style.opacity,
										outline: "none",
										transition:
											"fill 200ms ease, stroke 200ms ease, opacity 200ms ease",
									}}
									className="mapa-geography focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
								/>
							);
						})}
						{seleccionado && (
							<path
								d={seleccionado.path ?? ""}
								fill="none"
								stroke="var(--map-highlight)"
								strokeWidth={2.5}
								vectorEffect="non-scaling-stroke"
								pointerEvents="none"
								strokeLinejoin="round"
								focusable="false"
							/>
						)}
					</>
				);
			}}
		</Mercator>
	);
});

// SVG memoizado: en pan/zoom solo cambia el transform del <g>
const MapaRenderizado = React.memo(
	({
		features,
		view,
		svgRef,
		didDragRef,
		onPointerDown,
		getCartelStyle,
		selectedState,
		onSelectState,
		setTooltip,
		mapScale,
		preserveAspectRatio,
		containerRef,
		patronesDefs,
	}: MapaMemoizadoProps) => {
		return (
			<div className="absolute inset-0 z-10">
				<svg
					ref={svgRef}
					viewBox={`0 0 ${MAP_VIEW_WIDTH} ${MAP_VIEW_HEIGHT}`}
					preserveAspectRatio={preserveAspectRatio}
					className="w-full h-full"
					role="img"
					aria-label="Mapa de México con control territorial de organizaciones criminales"
					style={{ touchAction: "none" }}
					onPointerDown={onPointerDown}
				>
					<MapPatterns patronesDefs={patronesDefs} />

					{/* Grupo con pan/zoom */}
					<g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
						<MapaLayer
							features={features}
							getCartelStyle={getCartelStyle}
							selectedState={selectedState}
							onSelectState={onSelectState}
							setTooltip={setTooltip}
							didDragRef={didDragRef}
							mapScale={mapScale}
							containerRef={containerRef}
						/>
					</g>
				</svg>
			</div>
		);
	},
);
MapaRenderizado.displayName = "MapaRenderizado";

export default MapaRenderizado;
