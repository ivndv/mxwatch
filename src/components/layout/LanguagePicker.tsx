"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import { deLocalizeHref, type Locale, localizeHref } from "@/paraglide/runtime";

// Idiomas disponibles con su etiqueta visible
const IDIOMAS: Array<{ valor: Locale; nombre: string; codigo: string }> = [
	{ valor: "en", nombre: "English", codigo: "EN" },
	{ valor: "es", nombre: "Español", codigo: "ES" },
];

function GloboIcono() {
	return (
		<svg
			className="h-4 w-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.8}
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
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

// Selector de idioma con menú y estado activo
export default function LanguagePicker() {
	const locale = useLocale();
	const pathname = usePathname();
	const [abierto, setAbierto] = useState(false);
	const contenedor = useRef<HTMLDivElement>(null);

	// Ruta canónica para poder localizarla al otro idioma
	const rutaCanonica = deLocalizeHref(pathname);
	const actual = IDIOMAS.find((i) => i.valor === locale) ?? IDIOMAS[0];

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

	return (
		<div className="relative" ref={contenedor}>
			<button
				type="button"
				onClick={() => setAbierto((v) => !v)}
				aria-haspopup="menu"
				aria-expanded={abierto}
				aria-label={m.nav_language({}, { locale })}
				className="inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-secondary transition-colors hover:bg-hover hover:text-primary"
			>
				<GloboIcono />
				<span className="hidden sm:inline text-xs font-semibold tracking-wide">
					{actual.codigo}
				</span>
				<ChevronIcono />
			</button>

			{abierto && (
				<div
					role="menu"
					aria-label={m.nav_language({}, { locale })}
					className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-border-subtle bg-card p-1.5 shadow-float"
				>
					{IDIOMAS.map(({ valor, nombre }) => {
						const activo = valor === locale;
						return (
							<Link
								key={valor}
								href={localizeHref(rutaCanonica, { locale: valor })}
								role="menuitemradio"
								aria-checked={activo}
								onClick={() => setAbierto(false)}
								className={`
									flex h-9 items-center justify-between rounded-lg px-2.5 text-[13px] transition-colors
									${activo ? "bg-hover text-primary" : "text-secondary hover:bg-hover hover:text-primary"}
								`}
							>
								<span>{nombre}</span>
								{activo && <CheckIcono />}
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
