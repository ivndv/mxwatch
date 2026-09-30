import { Mercator } from "@visx/geo";
import type { Feature, Geometry } from "geojson";
import React, { useCallback } from "react";
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
	setSelectedState,
	setTooltip,
	didDragRef,
	mapScale,
	containerRef,
}: {
	features: Feature<Geometry>[];
	getCartelStyle: (nombreEstado: string) => CartelStyle;
	selectedState: string | null;
	setSelectedState: (state: string | null) => void;
	setTooltip: React.Dispatch<React.SetStateAction<TooltipState | null>>;
	didDragRef: { current: boolean };
	mapScale: number;
	containerRef: React.RefObject<HTMLDivElement | null>;
}) {
	// Tooltip al hover (se omite al arrastrar)
	const handleMouseEnter = useCallback(
		(
			e: React.MouseEvent | React.TouchEvent,
			nombreEstado: string,
			style: CartelStyle,
		) => {
			if (didDragRef.current || !containerRef.current) return;
			// Posición del tooltip relativa al contenedor
			const rect = containerRef.current.getBoundingClientRect();
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			setTooltip({
				content: nombreEstado,
				cartel: style.cartel,
				// Color: stroke o fallback si es blanco
				color:
					style.stroke === "white"
						? (style.liveDataRaw?.color ?? "#8b98b8")
						: style.stroke,
				x: clientX - rect.left,
				y: clientY - rect.top,
			});
		},
		[containerRef, setTooltip, didDragRef],
	);

	// Actualiza la posición del tooltip (se omite al arrastrar)
	const handleMouseMove = useCallback(
		(e: React.MouseEvent | React.TouchEvent) => {
			if (didDragRef.current || !containerRef.current) return;
			const rect = containerRef.current.getBoundingClientRect();
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			// Conserva el contenido; solo mueve la posición
			setTooltip((prev) =>
				prev
					? { ...prev, x: clientX - rect.left, y: clientY - rect.top }
					: null,
			);
		},
		[containerRef, setTooltip, didDragRef],
	);

	// Alterna la selección (se omite si fue arrastre)
	const handleSelect = useCallback(
		(nombreEstado: string) => {
			if (didDragRef.current) return;
			setSelectedState(selectedState === nombreEstado ? null : nombreEstado);
		},
		[didDragRef, selectedState, setSelectedState],
	);

	return (
		<Mercator<EstadoFeature>
			data={features}
			center={MEXICO_CENTER}
			translate={VIEW_TRANSLATE}
			scale={mapScale}
		>
			{({ features: geos }) =>
				geos.map(({ feature, path, index }) => {
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
							onMouseLeave={() => setTooltip(null)}
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
								transition: "all 200ms ease",
							}}
							className="mapa-geography focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
						/>
					);
				})
			}
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
		setSelectedState,
		setTooltip,
		mapScale,
		containerRef,
		patronesDefs,
	}: MapaMemoizadoProps) => {
		return (
			<div className="absolute inset-0 z-10">
				<svg
					ref={svgRef}
					viewBox={`0 0 ${MAP_VIEW_WIDTH} ${MAP_VIEW_HEIGHT}`}
					className="w-full h-full"
					role="img"
					aria-label="Mapa de México con control territorial de cárteles"
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
							setSelectedState={setSelectedState}
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
