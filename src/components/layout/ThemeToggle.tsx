"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import type { Locale } from "@/paraglide/runtime";
import { type Tema, useThemeStore } from "@/store/themeStore";

function SolIcono() {
	return (
		<svg
			className="h-4 w-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.8}
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" />
			<path
				strokeLinecap="round"
				d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"
			/>
		</svg>
	);
}

function LunaIcono() {
	return (
		<svg
			className="h-4 w-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.8}
			aria-hidden="true"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"
			/>
		</svg>
	);
}

function MonitorIcono() {
	return (
		<svg
			className="h-4 w-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.8}
			aria-hidden="true"
		>
			<rect x="3" y="4" width="18" height="12" rx="2" />
			<path strokeLinecap="round" d="M8 20h8" />
		</svg>
	);
}

function ChevronIcono() {
	return (
		<svg
			className="h-3 w-3 opacity-60"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2.2}
			aria-hidden="true"
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
		</svg>
	);
}

function CheckIcono() {
	return (
		<svg
			className="h-3.5 w-3.5 text-accent"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2.5}
			aria-hidden="true"
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
		</svg>
	);
}

// Icono que representa cada preferencia
function IconoTema({ tema }: { tema: Tema }) {
	if (tema === "light") return <SolIcono />;
	if (tema === "system") return <MonitorIcono />;
	return <LunaIcono />;
}

// Etiqueta traducida de cada preferencia
function etiquetaTema(tema: Tema, locale: Locale): string {
	if (tema === "light") return m.theme_light({}, { locale });
	if (tema === "system") return m.theme_system({}, { locale });
	return m.theme_dark({}, { locale });
}

// Selector de tema con menú: claro, oscuro o sistema
export default function ThemeToggle() {
	const locale = useLocale();
	const tema = useThemeStore((s) => s.tema);
	const establecerTema = useThemeStore((s) => s.establecerTema);
	const [abierto, setAbierto] = useState(false);
	const [montado, setMontado] = useState(false);
	const contenedor = useRef<HTMLDivElement>(null);

	// Evita desajustes de hidratación: la preferencia vive en localStorage
	useEffect(() => setMontado(true), []);

	// Cierra al hacer click fuera o pulsar Escape
	useEffect(() => {
		if (!abierto) return;

		const alClicFuera = (e: MouseEvent) => {
			if (contenedor.current && !contenedor.current.contains(e.target as Node))
				setAbierto(false);
		};
		const alPulsarTecla = (e: KeyboardEvent) => {
			if (e.key === "Escape") setAbierto(false);
		};

		document.addEventListener("mousedown", alClicFuera);
		document.addEventListener("keydown", alPulsarTecla);
		return () => {
			document.removeEventListener("mousedown", alClicFuera);
			document.removeEventListener("keydown", alPulsarTecla);
		};
	}, [abierto]);

	const opciones: Tema[] = ["light", "dark", "system"];

	return (
		<div className="relative" ref={contenedor}>
			<button
				type="button"
				onClick={() => setAbierto((v) => !v)}
				aria-haspopup="menu"
				aria-expanded={abierto}
				aria-label={`${m.theme_label({}, { locale })}: ${etiquetaTema(tema, locale)}`}
				className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-elevated px-2 text-secondary transition-colors hover:bg-hover hover:text-primary"
			>
				{montado ? <IconoTema tema={tema} /> : <span className="h-4 w-4" />}
				<ChevronIcono />
			</button>

			{abierto && (
				<div
					role="menu"
					aria-label={m.theme_label({}, { locale })}
					className="absolute right-0 top-full z-50 mt-2 w-40 rounded-lg border border-border bg-card p-1 shadow-lg"
				>
					{opciones.map((opcion) => {
						const activo = opcion === tema;
						return (
							<button
								key={opcion}
								type="button"
								role="menuitemradio"
								aria-checked={activo}
								onClick={() => {
									establecerTema(opcion);
									setAbierto(false);
								}}
								className={`
									flex h-8 w-full items-center justify-between rounded-md px-2 text-xs transition-colors
									${activo ? "bg-hover text-primary" : "text-secondary hover:bg-hover hover:text-primary"}
								`}
							>
								<span>{etiquetaTema(opcion, locale)}</span>
								{activo && <CheckIcono />}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
