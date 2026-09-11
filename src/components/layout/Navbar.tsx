import Image from "next/image";
import Link from "next/link";

/**
 * Barra de navegación principal fija.
 * Incluye logotipo, nombre del proyecto y enlace a la página de inicio.
 */
export default function Navbar() {
	return (
		<header className="fixed top-0 left-0 right-0 z-50 h-[64px] border-b border-white/10 bg-surface/60 backdrop-blur-md pt-[env(safe-area-inset-top)]">
			<nav
				className="w-full max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-center"
				aria-label="Navegación principal"
			>
				{/* Enlace al Home con logotipo y branding */}
				<Link
					href="/"
					className="flex items-center gap-3 select-none transition-opacity hover:opacity-90"
					aria-label="mxwatch home"
				>
					<Image
						src="https://assets.mgdc.site/mxwatch/logo.png"
						alt="MxWatch Logo"
						width={32}
						height={32}
						className="w-8 h-8 rounded-lg shadow-[0_0_15px_rgba(230,57,70,0.3)]"
					/>
					<div className="flex flex-col leading-none">
						<span className="text-lg font-bold tracking-tight text-primary">
							mxwatch
						</span>
						{/* Indicador de estado del proyecto */}
						<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent leading-none">
							beta
						</span>
					</div>
				</Link>
			</nav>
		</header>
	);
}
