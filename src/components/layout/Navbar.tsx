"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import { localizeHref } from "@/paraglide/runtime";
import LanguagePicker from "./LanguagePicker";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";

/**
 * Barra de navegación principal fija.
 * En escritorio: logo, enlaces y controles.
 * En móvil: logo y menú hamburguesa con enlaces y ajustes.
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
		<header className="fixed top-0 left-0 right-0 z-50 h-[calc(64px+env(safe-area-inset-top))] border-b border-border-subtle bg-surface/80 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
			<nav
				className="w-full max-w-6xl mx-auto h-full px-4 sm:px-6 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-3"
				aria-label={m.nav_section({}, { locale })}
			>
				{/* Identidad de marca */}
				<Link
					href={localizeHref("/", { locale })}
					className="justify-self-start flex items-center gap-2.5 min-h-11 min-w-11 select-none transition-opacity hover:opacity-80"
					aria-label="mxwatch — home"
				>
					<Image
						src="https://assets.liuma.app/mxwatch/logo.png"
						alt="MxWatch Logo"
						width={30}
						height={30}
						className="w-7 h-7 rounded-lg"
					/>
					<span className="font-semibold text-[15px] tracking-tight text-primary max-[379px]:hidden">
						mxwatch
					</span>
				</Link>

				{/* Enlaces con estado activo (escritorio) */}
				<ul className="hidden md:flex justify-self-center items-center gap-1">
					{enlaces.map(({ href, label }) => {
						const activo = estaActivo(href);
						return (
							<li key={href}>
								<Link
									href={localizeHref(href, { locale })}
									aria-current={activo ? "page" : undefined}
									className={`
										relative inline-flex items-center min-h-11 rounded-full px-4 text-[13px] font-medium transition-colors
										${activo ? "text-primary" : "text-secondary hover:bg-hover hover:text-primary"}
									`}
								>
									{label}
									{activo && (
										<span
											aria-hidden="true"
											className="absolute inset-x-4 -bottom-[9px] h-0.5 rounded-full bg-accent"
										/>
									)}
								</Link>
							</li>
						);
					})}
				</ul>

				{/* Controles de idioma y tema (escritorio) */}
				<div className="justify-self-end hidden md:flex items-center gap-1">
					<LanguagePicker />
					<ThemeToggle />
				</div>

				{/* Menú hamburguesa (móvil): navegación y ajustes */}
				<MobileMenu />
			</nav>
		</header>
	);
}
