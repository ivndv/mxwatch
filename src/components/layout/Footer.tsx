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
		<footer className="w-full border-t border-border-subtle bg-surface mt-auto transition-colors duration-200">
			<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
				{/* Grid principal: marca, navegación, legal y boletín */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
					{/* Columna 1: identidad y estado */}
					<div className="flex flex-col gap-4">
						<Link
							href={localizeHref("/", { locale })}
							className="flex items-center gap-2.5 min-h-11 select-none w-fit transition-opacity hover:opacity-80"
						>
							<Image
								src="https://assets.liuma.app/mxwatch/logo.png"
								alt="MxWatch Logo"
								width={32}
								height={32}
								className="w-8 h-8 rounded-lg"
							/>
							<span className="text-lg font-semibold tracking-tight text-primary">
								mxwatch
							</span>
						</Link>
						<p className="text-secondary text-sm leading-relaxed max-w-xs">
							{m.footer_tagline({}, { locale })}
						</p>
						<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-elevated border border-border-subtle w-fit">
							<span className="h-1.5 w-1.5 rounded-full animate-pulse bg-accent" />
							<span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-tertiary">
								{m.footer_active({}, { locale })}
							</span>
						</div>
					</div>

					{/* Columna 2: navegación principal */}
					<div className="flex flex-col gap-4">
						<h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
							{m.footer_platform({}, { locale })}
						</h3>
						<ul className="flex flex-col gap-1">
							{enlaces.map(({ href, label }) => (
								<li key={href}>
									<Link
										href={localizeHref(href, { locale })}
										className="inline-flex items-center min-h-11 text-sm text-secondary hover:text-primary transition-colors"
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Columna 3: enlaces legales */}
					<div className="flex flex-col gap-4">
						<h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
							{m.footer_legal({}, { locale })}
						</h3>
						<ul className="flex flex-col gap-1">
							{legales.map(({ href, label }) => (
								<li key={href}>
									<Link
										href={localizeHref(href, { locale })}
										className="inline-flex items-center min-h-11 text-sm text-secondary hover:text-primary transition-colors"
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Columna 4: boletín */}
					<div className="flex flex-col gap-4">
						<h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
							{m.footer_newsletter({}, { locale })}
						</h3>
						<form
							className="flex flex-col gap-2.5"
							onSubmit={(e) => e.preventDefault()}
						>
							<input
								id="boletin-email"
								name="email"
								type="email"
								autoComplete="email"
								aria-label={m.footer_email_label({}, { locale })}
								placeholder={m.footer_email_placeholder({}, { locale })}
								className="px-3.5 h-11 rounded-lg border border-border-subtle bg-input text-primary text-sm placeholder:text-tertiary focus:outline-none focus:border-accent/60 transition-colors"
							/>
							<button
								type="submit"
								className="px-4 h-11 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors shadow-card"
							>
								{m.footer_subscribe({}, { locale })}
							</button>
						</form>
					</div>
				</div>

				{/* Barra inferior: créditos, stack y copyright */}
				<div className="border-t border-border-subtle pt-8 flex flex-col items-center gap-6">
					<div className="flex flex-col items-center gap-4">
						<p className="text-sm text-secondary">
							{m.footer_developed_by({}, { locale })}{" "}
							<span className="font-semibold text-primary">Sinx</span>
						</p>
						<div className="flex flex-wrap justify-center gap-2">
							{TECNOLOGIAS.map((tech) => (
								<span
									key={tech}
									className="px-3 py-1 text-xs font-medium rounded-full border border-border-subtle bg-elevated text-tertiary transition-colors hover:text-secondary cursor-default"
								>
									{tech}
								</span>
							))}
						</div>
					</div>

					<p className="text-xs text-tertiary text-center">
						© {new Date().getFullYear()}{" "}
						<span className="font-semibold text-secondary">mxwatch</span> —{" "}
						{m.footer_rights({}, { locale })}
					</p>
				</div>
			</div>
		</footer>
	);
}
