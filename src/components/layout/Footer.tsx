"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import { deLocalizeHref, localizeHref } from "@/paraglide/runtime";

// Tecnologías mostradas en el pie
const TECNOLOGIAS = ["Next.js", "Tailwind", "D3-geo", "TopoJSON", "Hono"];

/**
 * Pie de página global con información institucional, navegación y estado del sistema.
 * Se oculta automáticamente en la vista del mapa para maximizar el área visual.
 */
export default function Footer() {
	const locale = useLocale();
	const pathname = usePathname();

	// Se compara la ruta canónica porque pathname viene localizado
	if (deLocalizeHref(pathname) === "/map") return null;

	const enlaces = [
		{ href: "/", label: m.nav_home({}, { locale }) },
		{ href: "/map", label: m.nav_map({}, { locale }) },
	];

	const legales = [
		{ href: "/legal/terms", label: m.footer_terms({}, { locale }) },
		{ href: "/legal/privacy", label: m.footer_privacy({}, { locale }) },
	];

	return (
		<footer className="w-full border-t border-border bg-surface mt-auto transition-colors duration-300">
			<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16">
				{/* Grid principal: Branding, Navegación, Legal y Newsletter */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
					{/* Columna 1: Identidad y Estado del Sistema */}
					<div className="flex flex-col gap-5">
						<Link
							href={localizeHref("/", { locale })}
							className="flex items-center gap-3 select-none w-fit group"
						>
							<Image
								src="https://assets.liuma.app/mxwatch/logo.png"
								alt="MxWatch Logo"
								width={32}
								height={32}
								className="w-8 h-8 rounded-lg shadow-[0_0_15px_rgba(230,57,70,0.3)] group-hover:scale-110 transition-transform"
							/>
							<span className="text-xl font-bold tracking-tight text-primary">
								mxwatch
							</span>
						</Link>
						<p className="text-secondary text-sm leading-relaxed max-w-xs">
							{m.footer_tagline({}, { locale })}
						</p>
						{/* Indicador de actividad en tiempo real */}
						<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-elevated border border-border w-fit">
							<span className="h-1.5 w-1.5 rounded-full animate-pulse bg-accent shadow-[0_0_8px_var(--accent-glow)]" />
							<span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
								{m.footer_active({}, { locale })}
							</span>
						</div>
					</div>

					{/* Columna 2: Navegación Principal */}
					<div className="flex flex-col gap-5">
						<h3 className="font-bold text-primary uppercase tracking-wider text-xs">
							{m.footer_platform({}, { locale })}
						</h3>
						<ul className="flex flex-col gap-3">
							{enlaces.map(({ href, label }) => (
								<li key={href}>
									<Link
										href={localizeHref(href, { locale })}
										className="text-sm text-secondary hover:text-accent transition-colors"
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Columna 3: Enlaces Legales */}
					<div className="flex flex-col gap-5">
						<h3 className="font-bold text-primary uppercase tracking-wider text-xs">
							{m.footer_legal({}, { locale })}
						</h3>
						<ul className="flex flex-col gap-3">
							{legales.map(({ href, label }) => (
								<li key={href}>
									<Link
										href={localizeHref(href, { locale })}
										className="text-sm text-secondary hover:text-accent transition-colors"
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Columna 4: Suscripción al Boletín */}
					<div className="flex flex-col gap-5">
						<h3 className="font-bold text-primary uppercase tracking-wider text-xs">
							{m.footer_newsletter({}, { locale })}
						</h3>
						<form
							className="flex flex-col gap-3"
							onSubmit={(e) => e.preventDefault()}
						>
							<input
								id="boletin-email"
								name="email"
								type="email"
								autoComplete="email"
								aria-label={m.footer_email_label({}, { locale })}
								placeholder={m.footer_email_placeholder({}, { locale })}
								className="px-4 py-2 rounded-md border border-border bg-elevated text-primary text-sm focus:outline-none focus:border-accent transition-all"
							/>
							<button
								type="submit"
								className="px-4 py-2 rounded-md bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors shadow-lg shadow-accent/10"
							>
								{m.footer_subscribe({}, { locale })}
							</button>
						</form>
					</div>
				</div>

				{/* Barra inferior: Créditos, Stack Tecnológico y Copyright */}
				<div className="border-t border-border pt-12 flex flex-col items-center gap-8">
					{/* Créditos y Tecnologías Utilizadas */}
					<div className="flex flex-col items-center gap-5">
						<p className="text-sm font-medium text-secondary">
							{m.footer_developed_by({}, { locale })}{" "}
							<span className="font-bold text-primary">Sinx</span>
						</p>
						<div className="flex flex-wrap justify-center gap-2">
							{TECNOLOGIAS.map((tech) => (
								<span
									key={tech}
									className="px-3 py-1 text-xs font-medium rounded-full border border-border bg-elevated text-secondary transition-all hover:border-accent hover:text-accent cursor-default"
								>
									{tech}
								</span>
							))}
						</div>
					</div>

					{/* Copyright Dinámico */}
					<p className="text-xs text-tertiary text-center">
						© {new Date().getFullYear()}{" "}
						<span className="font-bold text-tertiary/80">mxwatch</span> —{" "}
						{m.footer_rights({}, { locale })}
					</p>
				</div>
			</div>
		</footer>
	);
}
