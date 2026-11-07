"use client";

// Animaciones
import {
	AnimatePresence,
	motion,
	type PanInfo,
	useDragControls,
} from "framer-motion";

// React y Next
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { ClearButton, SearchIcon } from "@/components/ui/icons";
import { useLocale } from "@/i18n/LocaleProvider";
// Estado del servidor (TanStack Query)
import {
	useCarteles,
	useDetalleCartel,
	useInteligencia,
	usePresencia,
} from "@/lib/useMapaQueries";
// Traducciones
import * as m from "@/paraglide/messages";
// Store de UI (Zustand)
import {
	useBusqueda,
	useCartelSeleccionado,
	useEstadoSeleccionado,
	useMapStore,
} from "@/store/mapStore";
import EstadisticasRapidas from "./EstadisticasRapidas";
// Componentes locales
import LeyendaCarteles from "./LeyendaCarteles";
import PanelDetalleCartel from "./PanelDetalleCartel";
import PanelEstadoSeleccionado from "./PanelEstadoSeleccionado";
import ResultadosBusqueda from "./ResultadosBusqueda";
import { SidebarFooter } from "./SidebarFooter";

type Snap = "peek" | "half" | "full";

export default function Sidebar() {
	const locale = useLocale();
	const router = useRouter();
	const searchParams = useSearchParams();

	// Estado de UI (Zustand)
	const busqueda = useBusqueda();
	const cartelSeleccionado = useCartelSeleccionado();
	const estadoSeleccionado = useEstadoSeleccionado();

	// Acciones del store
	const establecerBusqueda = useMapStore((s) => s.establecerBusqueda);
	const alternarCartel = useMapStore((s) => s.alternarCartel);
	const establecerCartelSeleccionado = useMapStore(
		(s) => s.establecerCartelSeleccionado,
	);
	const establecerEstadoSeleccionado = useMapStore(
		(s) => s.establecerEstadoSeleccionado,
	);

	// Estado del servidor (TanStack Query)
	const { data: datosPresencia = [], dataUpdatedAt: presenciaUpdatedAt } =
		usePresencia();
	const {
		data: todosCarteles = [],
		isError: errorCarteles,
		refetch: reintentarCarteles,
		dataUpdatedAt: cartelesUpdatedAt,
	} = useCarteles();
	const {
		data: inteligenciaEstado,
		isLoading: cargandoInteligencia,
		error: errorInteligencia,
		refetch: reintentarInteligencia,
	} = useInteligencia(estadoSeleccionado);
	const {
		data: detalleCartel,
		isLoading: cargandoDetalleCartel,
		error: errorDetalleCartel,
		refetch: reintentarDetalleCartel,
	} = useDetalleCartel(cartelSeleccionado);

	const colorPrincipal = useMemo(
		() => inteligenciaEstado?.carteles[0]?.color || null,
		[inteligenciaEstado],
	);

	const actualizadoEn =
		Math.max(presenciaUpdatedAt ?? 0, cartelesUpdatedAt ?? 0) || null;

	// Mensajes de error para las alertas
	const mensajeErrorCarteles = errorCarteles ? "Fallo al cargar listado" : null;
	const mensajeErrorInteligencia = errorInteligencia
		? "Error de conexión"
		: null;
	const mensajeErrorDetalle = errorDetalleCartel ? "Error de conexión" : null;

	// Modo del panel: búsqueda, selección o inicio
	const modo = busqueda
		? "busqueda"
		: estadoSeleccionado || cartelSeleccionado
			? "seleccion"
			: "inicio";

	// Contexto que se muestra en el peek del sheet móvil
	const contexto =
		estadoSeleccionado ??
		detalleCartel?.nombre ??
		(busqueda
			? m.sidebar_search_label({}, { locale })
			: m.sidebar_analysis({}, { locale }));

	// Sheet móvil: snap points y arrastre
	const [esMovil, setEsMovil] = useState(
		() =>
			typeof window !== "undefined" &&
			window.matchMedia("(max-width: 767px)").matches,
	);
	const [altura, setAltura] = useState(() =>
		typeof window !== "undefined" ? window.innerHeight : 800,
	);
	const [altoHeader, setAltoHeader] = useState(64);
	const [snap, setSnap] = useState<Snap>("peek");
	const dragControls = useDragControls();
	const arrastrandoRef = useRef(false);

	// El sheet ocupa desde el borde inferior hasta el final del header fijo
	const altoHoja = Math.max(0, Math.round(altura - altoHeader));
	const offsets = useMemo(
		() => ({
			full: 0,
			half: Math.max(0, altoHoja - Math.round(altura * 0.5)),
			peek: altoHoja - 88,
		}),
		[altura, altoHoja],
	);
	const offset = esMovil ? offsets[snap] : 0;

	useEffect(() => {
		const mq = window.matchMedia("(max-width: 767px)");
		const actualizar = () => {
			setEsMovil(mq.matches);
			setAltura(window.innerHeight);
			setAltoHeader(
				document.querySelector("header")?.getBoundingClientRect().height ?? 64,
			);
		};

		actualizar();
		mq.addEventListener("change", actualizar);
		window.addEventListener("resize", actualizar);
		return () => {
			mq.removeEventListener("change", actualizar);
			window.removeEventListener("resize", actualizar);
		};
	}, []);

	// Abre el sheet a half cuando hay búsqueda o selección
	useEffect(() => {
		if (estadoSeleccionado || cartelSeleccionado || busqueda) {
			setSnap((actual) => (actual === "peek" ? "half" : actual));
		}
	}, [estadoSeleccionado, cartelSeleccionado, busqueda]);

	const alternarSnap = useCallback(() => {
		if (!esMovil) return;
		setSnap((actual) =>
			actual === "peek" ? "half" : actual === "half" ? "full" : "peek",
		);
	}, [esMovil]);

	const alSoltar = useCallback(
		(_: unknown, info: PanInfo) => {
			const actual = offsets[snap];
			const destino = actual + info.offset.y;
			const cercano = (
				Object.keys(offsets) as Array<keyof typeof offsets>
			).reduce(
				(a, b) =>
					Math.abs(offsets[b] - destino) < Math.abs(offsets[a] - destino)
						? b
						: a,
				"full" as keyof typeof offsets,
			);

			setSnap(cercano);
			window.setTimeout(() => {
				arrastrandoRef.current = false;
			}, 0);
		},
		[offsets, snap],
	);

	const alTocarHandle = () => {
		if (arrastrandoRef.current) return;
		alternarSnap();
	};

	// Limpia toda la selección y la búsqueda
	const limpiarSeleccion = useCallback(() => {
		establecerEstadoSeleccionado(null);
		establecerCartelSeleccionado(null);
		establecerBusqueda("");
	}, [
		establecerEstadoSeleccionado,
		establecerCartelSeleccionado,
		establecerBusqueda,
	]);

	// Pasa de un cártel del panel de estado a su ficha
	const seleccionarCartelDesdeEstado = useCallback(
		(slug: string) => {
			establecerEstadoSeleccionado(null);
			establecerCartelSeleccionado(slug);
			establecerBusqueda("");
		},
		[
			establecerEstadoSeleccionado,
			establecerCartelSeleccionado,
			establecerBusqueda,
		],
	);

	// Pasa de un estado del panel de cártel a su ficha
	const seleccionarEstadoDesdeCartel = useCallback(
		(nombre: string) => {
			establecerCartelSeleccionado(null);
			establecerEstadoSeleccionado(nombre);
			establecerBusqueda("");
		},
		[
			establecerCartelSeleccionado,
			establecerEstadoSeleccionado,
			establecerBusqueda,
		],
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
					else if (cartelSeleccionado) establecerCartelSeleccionado(null);
					else if (busqueda) establecerBusqueda("");
					else if (esMovil && snap !== "peek") setSnap("peek");
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
		cartelSeleccionado,
		busqueda,
		esMovil,
		snap,
		todosCarteles,
		establecerEstadoSeleccionado,
		establecerCartelSeleccionado,
		establecerBusqueda,
		alternarCartel,
	]);

	return (
		<motion.aside
			drag={esMovil ? "y" : false}
			dragListener={false}
			dragControls={dragControls}
			dragConstraints={esMovil ? { top: 0, bottom: offsets.peek } : undefined}
			dragElastic={0.05}
			dragMomentum={false}
			onDragStart={() => {
				arrastrandoRef.current = true;
			}}
			onDragEnd={alSoltar}
			animate={{ y: offset }}
			initial={false}
			transition={{ type: "spring", stiffness: 320, damping: 32 }}
			className="fixed left-0 right-0 bottom-0 z-30 h-[calc(100dvh-64px-env(safe-area-inset-top))] rounded-t-3xl border-t border-border-subtle bg-surface shadow-float flex flex-col overflow-hidden md:relative md:left-auto md:right-auto md:bottom-auto md:z-auto md:h-full md:w-[360px] md:shrink-0 md:rounded-none md:border-t-0 md:border-r md:border-border-subtle md:shadow-none"
		>
			{/* Handle y contexto del sheet móvil */}
			<div className="md:hidden shrink-0 px-5 pt-2 pb-1 border-b border-border-subtle">
				<button
					type="button"
					onPointerDown={(e) => dragControls.start(e)}
					onClick={alTocarHandle}
					className="w-full h-11 flex items-center justify-center touch-none"
					aria-label={m.sheet_toggle({}, { locale })}
					aria-expanded={snap !== "peek"}
				>
					<span className="w-10 h-1 rounded-full bg-border-strong" />
				</button>
				<div className="flex items-center justify-between gap-3 pb-1">
					<h2 className="text-[13px] font-semibold tracking-tight text-primary truncate">
						{contexto}
					</h2>
					<span className="font-mono text-[11px] text-tertiary whitespace-nowrap">
						{todosCarteles.length} · {datosPresencia.length}
					</span>
				</div>
			</div>

			{/* Encabezado de escritorio con búsqueda */}
			<div className="hidden md:block px-5 py-4 border-b border-border-subtle bg-surface sticky top-0 z-10">
				<div className="flex items-center justify-between mb-3">
					<h2 className="text-[13px] font-semibold tracking-tight text-primary">
						{m.sidebar_analysis({}, { locale })}
					</h2>
					<InfoTooltip content={m.sidebar_shortcuts_hint({}, { locale })} />
				</div>
				<div className="relative">
					<input
						type="text"
						id="busqueda-mapa"
						name="busqueda"
						aria-label={m.sidebar_search_label({}, { locale })}
						placeholder={m.sidebar_search_placeholder({}, { locale })}
						value={busqueda}
						onChange={(e) => establecerBusqueda(e.target.value)}
						className="w-full bg-input border border-border-subtle rounded-lg h-11 pl-10 pr-12 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-accent/60 transition-colors"
					/>
					<SearchIcon />
					{busqueda && <ClearButton onClick={() => establecerBusqueda("")} />}
				</div>
			</div>

			<div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
				<div className="px-5 py-4 flex flex-col gap-4">
					{modo === "busqueda" && <ResultadosBusqueda />}

					{modo === "seleccion" && (
						<>
							<button
								type="button"
								onClick={limpiarSeleccion}
								className="self-start flex items-center gap-1 min-h-11 text-[13px] font-medium text-secondary hover:text-primary transition-colors"
							>
								← {m.sidebar_back({}, { locale })}
							</button>

							{estadoSeleccionado && (
								<AnimatePresence mode="wait">
									<motion.div
										key={estadoSeleccionado}
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
									>
										{cargandoInteligencia ? (
											<div className="rounded-xl border border-border-subtle bg-elevated p-6 flex flex-col items-center justify-center">
												<div className="w-7 h-7 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
												<span className="font-mono text-[11px] text-tertiary uppercase tracking-[0.18em]">
													{m.sidebar_loading_state({}, { locale })}
												</span>
											</div>
										) : mensajeErrorInteligencia ? (
											<ErrorAlert
												message={mensajeErrorInteligencia}
												onRetry={() => {
													void reintentarInteligencia();
												}}
											/>
										) : inteligenciaEstado ? (
											<PanelEstadoSeleccionado
												selectedState={estadoSeleccionado}
												stateIntelligence={inteligenciaEstado}
												primaryColor={colorPrincipal}
												onClear={limpiarSeleccion}
												onSelectCartel={seleccionarCartelDesdeEstado}
											/>
										) : null}
									</motion.div>
								</AnimatePresence>
							)}

							{!estadoSeleccionado && cartelSeleccionado && (
								<AnimatePresence mode="wait">
									<motion.div
										key={cartelSeleccionado}
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
									>
										{cargandoDetalleCartel ? (
											<div className="rounded-xl border border-border-subtle bg-elevated p-6 flex flex-col items-center justify-center">
												<div className="w-7 h-7 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
												<span className="font-mono text-[11px] text-tertiary uppercase tracking-[0.18em]">
													{m.sidebar_loading_cartel({}, { locale })}
												</span>
											</div>
										) : mensajeErrorDetalle ? (
											<ErrorAlert
												message={mensajeErrorDetalle}
												onRetry={() => {
													void reintentarDetalleCartel();
												}}
											/>
										) : detalleCartel ? (
											<PanelDetalleCartel
												cartel={detalleCartel}
												onClear={limpiarSeleccion}
												onSelectState={seleccionarEstadoDesdeCartel}
											/>
										) : null}
									</motion.div>
								</AnimatePresence>
							)}
						</>
					)}

					{modo === "inicio" && (
						<>
							<EstadisticasRapidas
								stateCount={datosPresencia.length}
								cartelsCount={todosCarteles.length}
							/>

							<div className="rounded-xl border border-border-subtle bg-elevated/50 p-5 text-center flex flex-col items-center gap-2">
								<div className="w-9 h-9 rounded-full border border-accent/25 bg-accent/10 flex items-center justify-center text-accent text-sm mb-1">
									◎
								</div>
								<p className="text-[14px] font-medium text-primary">
									{m.sidebar_empty_title({}, { locale })}
								</p>
								<p className="text-[13px] text-tertiary leading-relaxed">
									{m.sidebar_empty_hint({}, { locale })}
								</p>
							</div>

							{mensajeErrorCarteles ? (
								<ErrorAlert
									message={mensajeErrorCarteles}
									onRetry={() => {
										void reintentarCarteles();
									}}
								/>
							) : (
								<LeyendaCarteles />
							)}
						</>
					)}
				</div>
			</div>

			{/* Footer del panel */}
			<SidebarFooter actualizadoEn={actualizadoEn} />
		</motion.aside>
	);
}
