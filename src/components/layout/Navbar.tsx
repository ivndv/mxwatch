"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import { localizeHref } from "@/paraglide/runtime";
import LanguagePicker from "./LanguagePicker";
import ThemeToggle from "./ThemeToggle";

/**
 * Barra de navegación principal fija.
 * Logo a la izquierda, enlaces al centro y controles a la derecha.
 */
export default function Navbar() {
	const locale = useLocale();
	const pathname = usePathname();

	const enlaces = [
		{ href: "/", label: m.nav_home({}, { locale }) },
		{ href: "/map", label: m.nav_map({}, { locale }) },
	];

	// El pathname ya está localizado; se compara contra la ruta traducida
	const estaActivo = (href: string) => {
		const ruta = localizeHref(href, { locale });
		return href === "/" ? pathname === ruta : pathname.startsWith(ruta);
	};

	return (
		<header className="fixed top-0 left-0 right-0 z-50 h-[64px] border-b border-border bg-surface/60 backdrop-blur-md pt-[env(safe-area-inset-top)]">
			<nav
				className="w-full max-w-6xl mx-auto h-full px-4 sm:px-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3"
				aria-label="Navegación principal"
			>
				{/* Identidad de marca */}
				<Link
					href={localizeHref("/", { locale })}
					className="justify-self-start flex items-center gap-2.5 select-none transition-opacity hover:opacity-90"
					aria-label="mxwatch — home"
				>
					<Image
						src="https://assets.mgdc.site/mxwatch/logo.png"
						alt="MxWatch Logo"
						width={30}
						height={30}
						className="w-7 h-7 rounded-md shadow-[0_0_15px_rgba(230,57,70,0.25)]"
					/>
					<span className="font-display text-lg font-bold tracking-tight text-primary">
						mxwatch
					</span>
				</Link>

				{/* Enlaces con estado activo */}
				<ul className="justify-self-center flex items-center gap-1">
					{enlaces.map(({ href, label }) => {
						const activo = estaActivo(href);
						return (
							<li key={href}>
								<Link
									href={localizeHref(href, { locale })}
									aria-current={activo ? "page" : undefined}
									className={`
										relative inline-flex rounded-md px-3 py-1.5 text-sm font-medium transition-colors
										${activo ? "text-primary" : "text-secondary hover:text-primary"}
									`}
								>
									{label}
									{activo && (
										<span
											aria-hidden="true"
											className="absolute inset-x-3 -bottom-px h-px bg-accent"
										/>
									)}
								</Link>
							</li>
						);
					})}
				</ul>

				{/* Controles de idioma y tema */}
				<div className="justify-self-end flex items-center gap-2">
					<LanguagePicker />
					<ThemeToggle />
				</div>
			</nav>
		</header>
	);
}
