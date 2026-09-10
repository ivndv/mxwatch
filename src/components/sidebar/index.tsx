"use client";

// Animaciones
import { AnimatePresence, motion } from "framer-motion";

// React y Next
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

// Server actions
import {
	obtenerCarteles,
	obtenerDetalleCartel,
	obtenerInteligenciaEstado,
} from "@/actions/mapData";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { ClearButton, SearchIcon } from "@/components/ui/icons";
// Store (Zustand)
import {
	useBusqueda,
	useCargandoDetalleCartel,
	useCargandoInteligencia,
	useCartelSeleccionado,
	useDatosPresencia,
	useDetalleCartel,
	useErrorCarteles,
	useErrorDetalleCartel,
	useErrorInteligencia,
	useEstadoSeleccionado,
	useInteligenciaEstado,
	useMapStore,
	useTodosCarteles,
} from "@/store/mapStore";
import EstadisticasRapidas from "./EstadisticasRapidas";
// Componentes locales
import LeyendaCarteles from "./LeyendaCarteles";
import PanelDetalleCartel from "./PanelDetalleCartel";
import PanelEstadoSeleccionado from "./PanelEstadoSeleccionado";
import ResultadosBusqueda from "./ResultadosBusqueda";
import { SidebarFooter } from "./SidebarFooter";

export default function Sidebar() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Selectores de estado global (Zustand)
	const busqueda = useBusqueda();
	const cartelSeleccionado = useCartelSeleccionado();
	const estadoSeleccionado = useEstadoSeleccionado();
	const datosPresencia = useDatosPresencia();
	const inteligenciaEstado = useInteligenciaEstado();
	const cargandoInteligencia = useCargandoInteligencia();
	const errorInteligencia = useErrorInteligencia();
	const detalleCartel = useDetalleCartel();
	const cargandoDetalleCartel = useCargandoDetalleCartel();
	const errorDetalleCartel = useErrorDetalleCartel();
	const errorCarteles = useErrorCarteles();

	// Acciones del store
	const establecerBusqueda = useMapStore((s) => s.establecerBusqueda);
	const alternarCartel = useMapStore((s) => s.alternarCartel);
	const establecerEstadoSeleccionado = useMapStore(
		(s) => s.establecerEstadoSeleccionado,
	);
	const establecerInteligenciaEstado = useMapStore(
		(s) => s.establecerInteligenciaEstado,
	);
	const establecerCargandoInteligencia = useMapStore(
		(s) => s.establecerCargandoInteligencia,
	);
	const establecerErrorInteligencia = useMapStore(
		(s) => s.establecerErrorInteligencia,
	);
	const establecerDetalleCartel = useMapStore((s) => s.establecerDetalleCartel);
	const establecerCargandoDetalleCartel = useMapStore(
		(s) => s.establecerCargandoDetalleCartel,
	);
	const establecerErrorDetalleCartel = useMapStore(
		(s) => s.establecerErrorDetalleCartel,
	);
	const establecerTodosCarteles = useMapStore((s) => s.establecerTodosCarteles);
	const establecerCargandoCarteles = useMapStore(
		(s) => s.establecerCargandoCarteles,
	);
	const establecerErrorCarteles = useMapStore((s) => s.establecerErrorCarteles);
	const todosCarteles = useTodosCarteles();
	const colorPrincipal = useMemo(
		() => inteligenciaEstado?.carteles[0]?.color || null,
		[inteligenciaEstado],
	);

	// Sincronización con URL: lectura inicial (solo al montar)
	// biome-ignore lint/correctness/useExhaustiveDependencies: solo al montar
	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());
		const urlCartel = params.get("cartel");
		const urlSearch = params.get("search");
		const urlState = params.get("state");

		if (urlCartel && !cartelSeleccionado) alternarCartel(urlCartel);
		if (urlSearch && !busqueda) establecerBusqueda(urlSearch);
		if (urlState && !estadoSeleccionado) establecerEstadoSeleccionado(urlState);
	}, []);

	// Sincronización con URL: escritura al cambiar estado
	useEffect(() => {
		const params = new URLSearchParams();
		if (cartelSeleccionado) params.set("cartel", cartelSeleccionado);
		if (busqueda) params.set("search", busqueda);
		if (estadoSeleccionado) params.set("state", estadoSeleccionado);

		const nuevaUrl = params.toString()
			? `?${params.toString()}`
			: window.location.pathname;
		router.replace(nuevaUrl, { scroll: false });
	}, [cartelSeleccionado, busqueda, estadoSeleccionado, router]);

	// Atajos de teclado: ESC, Ctrl+F, Alt+1-9
	useEffect(() => {
		const manejarTecla = (e: KeyboardEvent) => {
			if (e.target instanceof HTMLInputElement) return;

			switch (e.key) {
				case "Escape":
					if (estadoSeleccionado) establecerEstadoSeleccionado(null);
					else if (busqueda) establecerBusqueda("");
					break;
				case "f":
				case "F":
					if (e.ctrlKey || e.metaKey) {
						e.preventDefault();
						document
							.querySelector<HTMLInputElement>('input[type="text"]')
							?.focus();
					}
					break;
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					if (e.altKey && todosCarteles.length > 0) {
						const indice = parseInt(e.key, 10) - 1;
						if (todosCarteles[indice])
							alternarCartel(
								todosCarteles[indice].slug || todosCarteles[indice].id,
							);
					}
					break;
			}
		};
		window.addEventListener("keydown", manejarTecla);
		return () => window.removeEventListener("keydown", manejarTecla);
	}, [
		estadoSeleccionado,
		busqueda,
		todosCarteles,
		establecerEstadoSeleccionado,
		establecerBusqueda,
		alternarCartel,
	]);

	// Carga inicial del listado de cárteles
	useEffect(() => {
		establecerCargandoCarteles(true);
		obtenerCarteles()
			.then((data) => {
				establecerTodosCarteles(data);
				establecerErrorCarteles(null);
			})
			.catch((err: unknown) => {
				console.error("Error al cargar carteles:", err);
				establecerErrorCarteles("Fallo al cargar listado");
			})
			.finally(() => establecerCargandoCarteles(false));
	}, [
		establecerTodosCarteles,
		establecerErrorCarteles,
		establecerCargandoCarteles,
	]);

	// Carga de inteligencia del estado seleccionado
	useEffect(() => {
		if (!estadoSeleccionado) {
			establecerInteligenciaEstado(null);
			establecerErrorInteligencia(null);
			return;
		}

		establecerCargandoInteligencia(true);
		establecerErrorInteligencia(null);

		obtenerInteligenciaEstado(estadoSeleccionado)
			.then((data) => {
				if (!data) {
					establecerErrorInteligencia("Sin datos para este estado");
					return;
				}
				establecerInteligenciaEstado(data);
			})
			.catch((err: unknown) => {
				console.error("Error al cargar inteligencia:", err);
				establecerErrorInteligencia("Error de conexión");
			})
			.finally(() => establecerCargandoInteligencia(false));
	}, [
		estadoSeleccionado,
		establecerErrorInteligencia,
		establecerCargandoInteligencia,
		establecerInteligenciaEstado,
	]);

	// Carga de detalle del cártel seleccionado
	useEffect(() => {
		if (!cartelSeleccionado) {
			establecerDetalleCartel(null);
			establecerErrorDetalleCartel(null);
			return;
		}

		establecerCargandoDetalleCartel(true);
		establecerErrorDetalleCartel(null);

		obtenerDetalleCartel(cartelSeleccionado)
			.then((data) => {
				if (!data) {
					establecerErrorDetalleCartel("Sin datos para este cártel");
					return;
				}
				establecerDetalleCartel(data);
			})
			.catch((err: unknown) => {
				console.error("Error al cargar detalle del cártel:", err);
				establecerErrorDetalleCartel("Error de conexión");
			})
			.finally(() => establecerCargandoDetalleCartel(false));
	}, [
		cartelSeleccionado,
		establecerDetalleCartel,
		establecerCargandoDetalleCartel,
		establecerErrorDetalleCartel,
	]);

	// Reintentos de carga
	const reintentarCarteles = useCallback(() => {
		establecerCargandoCarteles(true);
		establecerErrorCarteles(null);
		obtenerCarteles()
			.then(establecerTodosCarteles)
			.catch(() => establecerErrorCarteles("Fallo al reintentar"))
			.finally(() => establecerCargandoCarteles(false));
	}, [
		establecerErrorCarteles,
		establecerTodosCarteles,
		establecerCargandoCarteles,
	]);

	const reintentarInteligencia = useCallback(() => {
		if (!estadoSeleccionado) return;
		establecerCargandoInteligencia(true);
		establecerErrorInteligencia(null);
		obtenerInteligenciaEstado(estadoSeleccionado)
			.then(establecerInteligenciaEstado)
			.catch(() => establecerErrorInteligencia("Fallo al reintentar"))
			.finally(() => establecerCargandoInteligencia(false));
	}, [
		estadoSeleccionado,
		establecerInteligenciaEstado,
		establecerErrorInteligencia,
		establecerCargandoInteligencia,
	]);

	// Control de apertura del panel en mobile
	const [sidebarAbierta, setSidebarAbierta] = useState(false);

	useEffect(() => {
		if (estadoSeleccionado || cartelSeleccionado) {
			setSidebarAbierta(true);
		}
	}, [estadoSeleccionado, cartelSeleccionado]);

	return (
		<>
			{/* Backdrop para mobile */}
			{sidebarAbierta && (
				<button
					type="button"
					className="md:hidden fixed inset-0 bg-black/50 z-20"
					onClick={() => setSidebarAbierta(false)}
					aria-label="Cerrar panel"
				/>
			)}
			{/* Panel lateral de inteligencia */}
			<aside
				className={`
					fixed md:relative bottom-0 left-0 right-0 z-30
					md:w-[380px] bg-card border-t md:border-t-0 md:border-r border-white/10
					flex flex-col shrink-0 shadow-2xl
					transition-all duration-300 ease-in-out
					${sidebarAbierta ? "h-[75vh] md:h-full" : "h-auto md:h-full"}
				`}
			>
				{/* Toggle handle para mobile */}
				<button
					type="button"
					className="md:hidden w-full py-1.5 flex items-center justify-center bg-card border-b border-white/5 active:bg-hover transition-colors"
					onClick={() => setSidebarAbierta((p) => !p)}
					aria-label={sidebarAbierta ? "Cerrar panel" : "Abrir panel"}
				>
					<div className="w-10 h-1 rounded-full bg-tertiary" />
				</button>
				<div className="p-3 md:p-4 border-b border-white/10 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
					{/* Encabezado y barra de búsqueda */}
					<div className="flex items-center justify-between mb-2 md:mb-3">
						<h2 className="text-[10px] md:text-sm font-bold tracking-widest uppercase text-primary">
							Centro de Análisis
						</h2>
						<InfoTooltip content="Atajos: Foco (Ctrl+F), ESC limpiar, Alt+1-9 selección rápida" />
					</div>
					<div className="relative">
						<input
							type="text"
							placeholder="Buscar estado o cártel..."
							value={busqueda}
							onChange={(e) => establecerBusqueda(e.target.value)}
							className="w-full bg-input border border-white/20 rounded-lg pl-10 pr-10 py-2 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-accent transition-colors"
						/>
						<SearchIcon />
						{busqueda && <ClearButton onClick={() => establecerBusqueda("")} />}
					</div>
				</div>

				<div className="flex-1 overflow-y-auto overflow-x-hidden">
					{/* Tabs de navegación */}
					{/* Tabs de navegación */}
					<div
						className="flex border-b border-white/5 bg-card sticky top-0 z-10"
						role="tablist"
						aria-label="Secciones de inteligencia"
					>
						<button
							type="button"
							role="tab"
							aria-selected="true"
							className="flex-1 py-3 text-xs font-bold uppercase tracking-wide text-accent border-b-2 border-accent bg-accent/10"
						>
							Cárteles
						</button>
						<button
							type="button"
							disabled
							role="tab"
							aria-selected="false"
							className="flex-1 py-3 text-xs font-bold uppercase tracking-wide text-tertiary opacity-30 cursor-not-allowed"
						>
							Incidentes
						</button>
					</div>

					<div className="p-4 flex flex-col gap-6">
						{/* Panel de estado seleccionado con inteligencia */}
						<AnimatePresence mode="wait">
							{estadoSeleccionado && (
								<motion.div
									key={estadoSeleccionado}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
								>
									{cargandoInteligencia ? (
										<div className="rounded-xl border border-white/10 bg-white/5 p-8 flex flex-col items-center justify-center">
											<div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
											<span className="text-xs text-secondary font-mono uppercase tracking-[0.2em]">
												Leyendo expediente...
											</span>
										</div>
									) : errorInteligencia ? (
										<ErrorAlert
											message={errorInteligencia}
											onRetry={reintentarInteligencia}
										/>
									) : inteligenciaEstado ? (
										<PanelEstadoSeleccionado
											selectedState={estadoSeleccionado}
											stateIntelligence={inteligenciaEstado}
											primaryColor={colorPrincipal}
											onClear={() => establecerEstadoSeleccionado(null)}
										/>
									) : null}
								</motion.div>
							)}
						</AnimatePresence>

						{/* Estadísticas rápidas */}
						<EstadisticasRapidas
							stateCount={datosPresencia.length}
							cartelsCount={todosCarteles.length}
						/>

						{/* Detalle de cártel seleccionado */}
						<AnimatePresence mode="wait">
							{cartelSeleccionado && !estadoSeleccionado && (
								<motion.div
									key={cartelSeleccionado}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
								>
									{cargandoDetalleCartel ? (
										<div className="rounded-xl border border-white/10 bg-white/5 p-8 flex flex-col items-center justify-center">
											<div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
											<span className="text-xs text-secondary font-mono uppercase tracking-[0.2em]">
												Cargando perfil...
											</span>
										</div>
									) : errorDetalleCartel ? (
										<ErrorAlert
											message={errorDetalleCartel}
											onRetry={() => {
												if (cartelSeleccionado) {
													establecerCargandoDetalleCartel(true);
													obtenerDetalleCartel(cartelSeleccionado)
														.then(establecerDetalleCartel)
														.catch(() =>
															establecerErrorDetalleCartel(
																"Fallo al reintentar",
															),
														)
														.finally(() =>
															establecerCargandoDetalleCartel(false),
														);
												}
											}}
										/>
									) : detalleCartel ? (
										<PanelDetalleCartel
											cartel={detalleCartel}
											onClear={() => alternarCartel(cartelSeleccionado)}
										/>
									) : null}
								</motion.div>
							)}
						</AnimatePresence>

						{/* Resultados de búsqueda */}
						<ResultadosBusqueda />

						{/* Leyenda de cárteles o error de carga */}
						{errorCarteles ? (
							<ErrorAlert
								message={errorCarteles}
								onRetry={reintentarCarteles}
							/>
						) : (
							<LeyendaCarteles />
						)}
					</div>
				</div>

				{/* Footer del panel */}
				<SidebarFooter />
			</aside>
		</>
	);
}
