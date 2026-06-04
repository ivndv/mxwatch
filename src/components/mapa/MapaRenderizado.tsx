import React, { useCallback } from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	ZoomableGroup,
} from "react-simple-maps";
import type { CartelStyle, MapaMemoizadoProps } from "./estilosCartel";

const MEXICO_CENTER: [number, number] = [-102.34, 24.01];
const MAX_ZOOM = 8;

// Renderizador SVG memoizado: evita re-renders masivos durante interacciones
const MapaRenderizado = React.memo(
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
	}: MapaMemoizadoProps) => {
		// Muestra el tooltip con datos del estado al hacer hover
		const handleMouseEnter = useCallback(
			(
				e: React.MouseEvent | React.TouchEvent,
				nombreEstado: string,
				style: CartelStyle,
			) => {
				if (!containerRef.current) return;
				// Calcula posición del tooltip relativa al contenedor
				const rect = containerRef.current.getBoundingClientRect();
				const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
				const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
				setTooltip({
					content: nombreEstado,
					cartel: style.cartel,
					// Color: usa el stroke o un fallback si es blanco
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

		// Actualiza la posición del tooltip al mover el mouse
		const handleMouseMove = useCallback(
			(e: React.MouseEvent | React.TouchEvent) => {
				if (!containerRef.current) return;
				const rect = containerRef.current.getBoundingClientRect();
				const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
				const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
				// Mantiene el contenido, solo actualiza posición
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
					{/* Definición de patrones SVG para multi-cártel */}
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

					{/* Zoom y renderizado de geografías */}
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
											// Oculta el tooltip al salir del estado
											onMouseLeave={() => setTooltip(null)}
											onTouchStart={(e) =>
												handleMouseEnter(e, nombreEstado, style)
											}
											onTouchMove={handleMouseMove}
											// Oculta el tooltip 1.5s después de soltar el toque
											onTouchEnd={() =>
												setTimeout(() => setTooltip(null), 1500)
											}
											// Selecciona o desselecciona el estado al hacer clic
											onClick={() =>
												setSelectedState(
													selectedState === nombreEstado ? null : nombreEstado,
												)
											}
											// Selecciona con Enter o Espacio (accesibilidad)
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
MapaRenderizado.displayName = "MapaRenderizado";

export default MapaRenderizado;
