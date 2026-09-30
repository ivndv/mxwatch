import { useCallback, useEffect, useRef, useState } from "react";
import type { ViewTransform } from "@/types/mapa";

// Coordenadas del viewBox del SVG; deben coincidir con MapaRenderizado
export const MAP_VIEW_WIDTH = 800;
export const MAP_VIEW_HEIGHT = 600;

// Vista inicial (sin pan ni zoom)
const DEFAULT_VIEW: ViewTransform = { x: 0, y: 0, k: 1 };
// Paso de zoom de botones y atajos
const ZOOM_STEP = 1.5;
// Sensibilidad de la rueda
const WHEEL_SENSITIVITY = 0.0015;
// Umbral (px) para distinguir un clic de un arrastre
const DRAG_THRESHOLD = 3;

interface UseMapViewParams {
	minZoom?: number;
	maxZoom?: number;
}

export interface UseMapViewReturn {
	view: ViewTransform;
	zoomIn: () => void;
	zoomOut: () => void;
	reset: () => void;
	didDragRef: { current: boolean };
	/** Callback ref del <svg>: engancha la rueda al montar. */
	svgRef: (el: SVGSVGElement | null) => void;
	onPointerDown: React.PointerEventHandler<SVGSVGElement>;
}

// Pan/zoom nativo (rueda, arrastre y pinch). Los gestos escuchan en window para
// no romper el clic de los paths; el rect se cachea por gesto y los updates se
// coalescen por frame con rAF.
export function useMapView({
	minZoom = 1,
	maxZoom = 8,
}: UseMapViewParams = {}): UseMapViewReturn {
	const [view, setView] = useState<ViewTransform>(DEFAULT_VIEW);
	const [activePointers, setActivePointers] = useState(0);

	// Nodo SVG: medición y listener de rueda
	const elementRef = useRef<SVGSVGElement | null>(null);
	// Rect cacheado del gesto (evita medir por frame)
	const rectRef = useRef<DOMRect | null>(null);
	// Frame pendiente de rAF
	const rafRef = useRef<number | null>(null);
	// Espejo de la vista para leerla dentro de los manejadores
	const viewRef = useRef<ViewTransform>(DEFAULT_VIEW);
	// Punteros activos (id -> cliente) para arrastre y pinch
	const pointers = useRef(new Map<number, { x: number; y: number }>());
	// Estado del pinch (distancia y punto medio previos)
	const pinchRef = useRef<{
		dist: number;
		mid: { x: number; y: number };
	} | null>(null);
	// Origen del arrastre (para el umbral)
	const dragStart = useRef<{ x: number; y: number } | null>(null);
	// Marca si el gesto fue arrastre (para suprimir el clic)
	const didDragRef = useRef(false);

	// Cachea el rect del SVG (solo al iniciar un gesto)
	const measure = useCallback(() => {
		rectRef.current = elementRef.current?.getBoundingClientRect() ?? null;
	}, []);

	// Rect cacheado; mide solo si aún no existe
	const getRect = useCallback(() => {
		if (!rectRef.current) measure();
		return rectRef.current;
	}, [measure]);

	// Aplica vista acotando solo el zoom (pan libre); coalesce con rAF
	const applyView = useCallback(
		(updater: (current: ViewTransform) => ViewTransform) => {
			const next = updater(viewRef.current);
			viewRef.current = {
				k: Math.min(maxZoom, Math.max(minZoom, next.k)),
				x: next.x,
				y: next.y,
			};
			if (rafRef.current == null) {
				rafRef.current = requestAnimationFrame(() => {
					rafRef.current = null;
					setView(viewRef.current);
				});
			}
		},
		[minZoom, maxZoom],
	);

	// Limpia el frame pendiente al desmontar
	useEffect(
		() => () => {
			if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
		},
		[],
	);

	// Escala de render (px por unidad del viewBox)
	const renderScale = useCallback(() => {
		const rect = getRect();
		if (!rect) return 1;
		return (
			Math.min(rect.width / MAP_VIEW_WIDTH, rect.height / MAP_VIEW_HEIGHT) || 1
		);
	}, [getRect]);

	// Convierte coordenadas de cliente (px) a viewBox
	const clientToViewBox = useCallback(
		(clientX: number, clientY: number) => {
			const rect = getRect();
			if (!rect) return { x: 0, y: 0 };
			const scale =
				Math.min(rect.width / MAP_VIEW_WIDTH, rect.height / MAP_VIEW_HEIGHT) ||
				1;
			const offsetX = rect.left + (rect.width - MAP_VIEW_WIDTH * scale) / 2;
			const offsetY = rect.top + (rect.height - MAP_VIEW_HEIGHT * scale) / 2;
			return { x: (clientX - offsetX) / scale, y: (clientY - offsetY) / scale };
		},
		[getRect],
	);

	// Zoom alrededor de un punto focal
	const zoomAbout = useCallback(
		(focal: { x: number; y: number }, factor: number) => {
			applyView((current) => {
				const k = current.k * factor;
				const ratio = k / current.k;
				return {
					k,
					x: focal.x - (focal.x - current.x) * ratio,
					y: focal.y - (focal.y - current.y) * ratio,
				};
			});
		},
		[applyView],
	);

	// Rueda: listener nativo no-pasivo para poder preventDefault
	const handleWheel = useCallback(
		(event: WheelEvent) => {
			event.preventDefault();
			// La rueda es discreta: mide fresco para un focal exacto
			rectRef.current = null;
			const focal = clientToViewBox(event.clientX, event.clientY);
			zoomAbout(focal, Math.exp(-event.deltaY * WHEEL_SENSITIVITY));
		},
		[clientToViewBox, zoomAbout],
	);

	// Callback ref: engancha/desengancha la rueda al montar/desmontar
	const setSvgElement = useCallback(
		(el: SVGSVGElement | null) => {
			const prev = elementRef.current;
			if (prev && prev !== el) {
				prev.removeEventListener("wheel", handleWheel);
			}
			elementRef.current = el;
			rectRef.current = null;
			if (el) {
				el.addEventListener("wheel", handleWheel, { passive: false });
			}
		},
		[handleWheel],
	);

	// Botones y atajos: zoom al centro del viewBox
	const zoomIn = useCallback(
		() =>
			zoomAbout({ x: MAP_VIEW_WIDTH / 2, y: MAP_VIEW_HEIGHT / 2 }, ZOOM_STEP),
		[zoomAbout],
	);
	const zoomOut = useCallback(
		() =>
			zoomAbout(
				{ x: MAP_VIEW_WIDTH / 2, y: MAP_VIEW_HEIGHT / 2 },
				1 / ZOOM_STEP,
			),
		[zoomAbout],
	);
	const reset = useCallback(() => applyView(() => DEFAULT_VIEW), [applyView]);

	// Inicializa el pinch con los dos punteros
	const startPinch = useCallback(() => {
		const [a, b] = [...pointers.current.values()];
		if (!a || !b) return;
		pinchRef.current = {
			dist: Math.hypot(a.x - b.x, a.y - b.y),
			mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
		};
	}, []);

	// pointerdown: registra el puntero y cachea el rect
	const onPointerDown = useCallback<React.PointerEventHandler<SVGSVGElement>>(
		(event) => {
			measure();
			pointers.current.set(event.pointerId, {
				x: event.clientX,
				y: event.clientY,
			});
			didDragRef.current = false;
			if (pointers.current.size === 1) {
				dragStart.current = { x: event.clientX, y: event.clientY };
				pinchRef.current = null;
			} else if (pointers.current.size === 2) {
				startPinch();
			}
			setActivePointers(pointers.current.size);
		},
		[measure, startPinch],
	);

	// pointermove global durante un gesto (pan y pinch)
	const handleWindowPointerMove = useCallback(
		(event: PointerEvent) => {
			const pointer = pointers.current.get(event.pointerId);
			if (!pointer) return;
			const prevX = pointer.x;
			const prevY = pointer.y;
			pointer.x = event.clientX;
			pointer.y = event.clientY;

			// Pinch: zoom por distancia + pan por punto medio
			if (pointers.current.size === 2) {
				didDragRef.current = true;
				const [a, b] = [...pointers.current.values()];
				const prev = pinchRef.current;
				if (!a || !b || !prev) return;
				const dist = Math.hypot(a.x - b.x, a.y - b.y);
				const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
				const scale = renderScale();
				const focal = clientToViewBox(mid.x, mid.y);
				const dx = (mid.x - prev.mid.x) / scale;
				const dy = (mid.y - prev.mid.y) / scale;
				const factor = prev.dist > 0 ? dist / prev.dist : 1;
				applyView((current) => {
					const k = current.k * factor;
					const ratio = k / current.k;
					return {
						k,
						x: focal.x - (focal.x - current.x) * ratio + dx,
						y: focal.y - (focal.y - current.y) * ratio + dy,
					};
				});
				pinchRef.current = { dist, mid };
				return;
			}

			// Arrastre: pan en coordenadas del viewBox
			if (pointers.current.size !== 1) return;
			const start = dragStart.current;
			if (!start) return;
			if (!didDragRef.current) {
				const moved = Math.hypot(
					event.clientX - start.x,
					event.clientY - start.y,
				);
				if (moved < DRAG_THRESHOLD) return;
				didDragRef.current = true;
			}
			const scale = renderScale();
			applyView((current) => ({
				...current,
				x: current.x + (event.clientX - prevX) / scale,
				y: current.y + (event.clientY - prevY) / scale,
			}));
		},
		[applyView, clientToViewBox, renderScale],
	);

	// pointerup/cancel: libera punteros y actualiza el conteo
	const handleWindowPointerUp = useCallback((event: PointerEvent) => {
		pointers.current.delete(event.pointerId);
		if (pointers.current.size < 2) pinchRef.current = null;
		if (pointers.current.size === 1) {
			const [remaining] = [...pointers.current.values()];
			if (remaining) {
				dragStart.current = { x: remaining.x, y: remaining.y };
			}
		}
		if (pointers.current.size === 0) {
			dragStart.current = null;
			// Invalida el rect cacheado al terminar el gesto
			rectRef.current = null;
		}
		setActivePointers(pointers.current.size);
	}, []);

	// Listeners globales solo mientras hay gesto activo
	useEffect(() => {
		if (activePointers === 0) return;
		window.addEventListener("pointermove", handleWindowPointerMove);
		window.addEventListener("pointerup", handleWindowPointerUp);
		window.addEventListener("pointercancel", handleWindowPointerUp);
		return () => {
			window.removeEventListener("pointermove", handleWindowPointerMove);
			window.removeEventListener("pointerup", handleWindowPointerUp);
			window.removeEventListener("pointercancel", handleWindowPointerUp);
		};
	}, [activePointers, handleWindowPointerMove, handleWindowPointerUp]);

	return {
		view,
		zoomIn,
		zoomOut,
		reset,
		didDragRef,
		svgRef: setSvgElement,
		onPointerDown,
	};
}
