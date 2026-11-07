"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import {
	deLocalizeHref,
	type Locale as LocaleType,
	localizeHref,
} from "@/paraglide/runtime";

// Preferencias posibles: claro, oscuro o sistema
type Tema = "light" | "dark" | "system";

// Idiomas disponibles en el menú móvil
const IDIOMAS: Array<{ valor: LocaleType; etiqueta: string }> = [
	{ valor: "es", etiqueta: "ES" },
	{ valor: "en", etiqueta: "EN" },
];

// Preferencias de tema en orden visible
const TEMAS: Tema[] = ["light", "dark", "system"];

// Etiqueta traducida de cada preferencia
function etiquetaTema(tema: Tema, locale: LocaleType): string {
	if (tema === "light") return m.theme_light({}, { locale });
	if (tema === "system") return m.theme_system({}, { locale });
	return m.theme_dark({}, { locale });
}

/**
 * Menú hamburguesa de móvil: navegación y ajustes (idioma y tema).
 * El panel se ancla debajo del header fijo y se cierra al navegar.
 */
export default function MobileMenu() {
	const locale = useLocale();
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();
	const tema = (theme ?? "dark") as Tema;

	const [abierto, setAbierto] = useState(false);
	const contenedor = useRef<HTMLDivElement>(null);
	const disparador = useRef<HTMLButtonElement>(null);
	const panel = useRef<HTMLDivElement>(null);

	const rutaCanonica = deLocalizeHref(pathname);

	const enlaces = [
		{ href: "/", label: m.nav_home({}, { locale }) },
		{ href: "/map", label: m.nav_map({}, { locale }) },
	];

	// El pathname ya está localizado; se compara contra la ruta traducida
	const estaActivo = (href: string) => {
		const ruta = localizeHref(href, { locale });
		return href === "/" ? pathname === ruta : pathname.startsWith(ruta);
	};

	// Cierra al navegar a otra ruta
	// biome-ignore lint/correctness/useExhaustiveDependencies: debe reejecutarse al cambiar de ruta
	useEffect(() => {
		setAbierto(false);
	}, [pathname]);

	// Cierra al hacer clic fuera, pulsar Escape o cambiar de tamaño a escritorio
	useEffect(() => {
		if (!abierto) return;

		const alClicFuera = (e: MouseEvent) => {
			if (contenedor.current && !contenedor.current.contains(e.target as Node))
				setAbierto(false);
		};
		const alPulsarTecla = (e: KeyboardEvent) => {
			if (e.key !== "Escape") return;
			setAbierto(false);
			disparador.current?.focus();
		};

		document.addEventListener("mousedown", alClicFuera);
		document.addEventListener("keydown", alPulsarTecla);
		return () => {
			document.removeEventListener("mousedown", alClicFuera);
			document.removeEventListener("keydown", alPulsarTecla);
		};
	}, [abierto]);

	// Enfoca el primer control al abrir
	useEffect(() => {
		if (!abierto) return;
		panel.current?.querySelector<HTMLElement>("a, button")?.focus();
	}, [abierto]);

	return (
		<div ref={contenedor} className="justify-self-end md:hidden">
			<button
				ref={disparador}
				type="button"
				onClick={() => setAbierto((v) => !v)}
				aria-expanded={abierto}
				aria-controls="menu-movil"
				aria-label={
					abierto
						? m.nav_menu_close({}, { locale })
						: m.nav_menu_open({}, { locale })
				}
				className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border-subtle bg-elevated text-secondary transition-colors hover:bg-hover hover:text-primary"
			>
				<span className="relative flex h-5 w-5 flex-col items-center justify-center gap-1">
					<span
						aria-hidden="true"
						className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${abierto ? "translate-y-[6px] rotate-45" : ""}`}
					/>
					<span
						aria-hidden="true"
						className={`block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${abierto ? "opacity-0" : ""}`}
					/>
					<span
						aria-hidden="true"
						className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${abierto ? "-translate-y-[6px] -rotate-45" : ""}`}
					/>
				</span>
			</button>

			<div
				ref={panel}
				id="menu-movil"
				hidden={!abierto}
				className="absolute inset-x-3 top-full z-50 mt-2 rounded-2xl border border-border-subtle bg-card p-2 shadow-float"
			>
				<nav aria-label={m.nav_section({}, { locale })}>
					<h2 className="px-2.5 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-tertiary">
						{m.nav_section({}, { locale })}
					</h2>
					<ul className="flex flex-col">
						{enlaces.map(({ href, label }) => {
							const activo = estaActivo(href);
							return (
								<li key={href}>
									<Link
										href={localizeHref(href, { locale })}
										aria-current={activo ? "page" : undefined}
										onClick={() => setAbierto(false)}
										className={`
											flex min-h-11 items-center justify-between rounded-lg px-2.5 text-sm font-medium transition-colors
											${activo ? "bg-elevated text-primary" : "text-secondary hover:bg-hover hover:text-primary"}
										`}
									>
										{label}
										{activo && (
											<span
												aria-hidden="true"
												className="h-1.5 w-1.5 rounded-full bg-accent"
											/>
										)}
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				<div className="my-2 h-px bg-border-subtle" />

				<section aria-label={m.settings_section({}, { locale })}>
					<h2 className="px-2.5 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-tertiary">
						{m.settings_section({}, { locale })}
					</h2>

					{/* Idioma */}
					<div className="flex items-center justify-between gap-3 px-2.5 py-1.5">
						<span className="text-sm text-secondary">
							{m.nav_language({}, { locale })}
						</span>
						<div className="flex items-center gap-1">
							{IDIOMAS.map(({ valor, etiqueta }) => {
								const activo = valor === locale;
								return (
									<Link
										key={valor}
										href={localizeHref(rutaCanonica, { locale: valor })}
										aria-current={activo ? "true" : undefined}
										onClick={() => setAbierto(false)}
										className={`
											inline-flex h-11 min-w-11 items-center justify-center rounded-lg border px-2 text-xs font-semibold transition-colors
											${activo ? "border-accent/40 bg-accent/10 text-primary" : "border-border-subtle bg-transparent text-secondary hover:bg-hover hover:text-primary"}
										`}
									>
										{etiqueta}
									</Link>
								);
							})}
						</div>
					</div>

					{/* Tema */}
					<div className="flex items-center justify-between gap-3 px-2.5 py-1.5">
						<span className="text-sm text-secondary">
							{m.theme_label({}, { locale })}
						</span>
						<div className="flex items-center gap-1">
							{TEMAS.map((opcion) => {
								const activo = opcion === tema;
								return (
									<button
										key={opcion}
										type="button"
										onClick={() => setTheme(opcion)}
										aria-pressed={activo}
										className={`
											inline-flex h-11 items-center justify-center rounded-lg border px-2 text-xs font-semibold transition-colors
											${activo ? "border-accent/40 bg-accent/10 text-primary" : "border-border-subtle bg-transparent text-secondary hover:bg-hover hover:text-primary"}
										`}
									>
										{etiquetaTema(opcion, locale)}
									</button>
								);
							})}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
