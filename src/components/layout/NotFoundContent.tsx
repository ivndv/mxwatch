// Navegación
import Link from "next/link";
import * as m from "@/paraglide/messages";
import { type Locale, localizeHref } from "@/paraglide/runtime";

/**
 * Contenido del 404 como server component: recibe el locale resuelto por
 * la ruta para renderizarse completo en el servidor (sin depender de JS).
 */
export default function NotFoundContent({ locale }: { locale: Locale }) {
	return (
		<main className="relative w-full flex flex-col items-center justify-center min-h-[calc(100dvh-64px)] px-8 text-center py-20 overflow-hidden bg-surface">
			{/* Efectos de iluminación de fondo para consistencia visual */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square opacity-[0.03] pointer-events-none rounded-full bg-primary blur-3xl z-0" />
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent opacity-[0.06] blur-[120px] pointer-events-none rounded-full z-0" />

			<div className="relative z-10 flex flex-col items-center">
				{/* Badge de estado: Notificación de error */}
				<div
					role="alert"
					className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-4 py-1.5 text-xs font-semibold tracking-wide uppercase text-accent shadow-sm backdrop-blur-md"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent-glow)]" />
					{m.notfound_badge({}, { locale })}
				</div>

				{/* Mensaje principal con temática de "cobertura" */}
				<h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl text-primary leading-tight">
					{m.notfound_title_1({}, { locale })}
					<br className="sm:hidden" />
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#f47e86]">
						{m.notfound_title_2({}, { locale })}
					</span>
				</h1>

				<p className="mt-6 max-w-lg text-lg leading-relaxed text-secondary font-medium">
					{m.notfound_body({}, { locale })}
				</p>

				{/* Opciones de navegación: Retorno al inicio o al mapa */}
				<div className="mt-12 flex flex-col sm:flex-row gap-4">
					<Link
						href={localizeHref("/", { locale })}
						className="group relative inline-flex h-12 md:h-14 items-center justify-center rounded-lg bg-accent px-8 text-base font-semibold text-white transition-all hover:bg-accent-hover hover:-translate-y-0.5 shadow-[0_0_30px_-10px_var(--accent-glow)]"
					>
						<svg
							className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						<span>{m.notfound_home({}, { locale })}</span>
					</Link>
					<Link
						href={localizeHref("/map", { locale })}
						className="inline-flex h-12 md:h-14 items-center justify-center rounded-lg border border-border bg-elevated px-8 text-base font-semibold text-primary transition-all hover:bg-hover"
					>
						{m.notfound_map({}, { locale })}
					</Link>
				</div>
			</div>

			{/* Rejilla táctica de fondo para ambientación */}
			<div
				className="absolute inset-0 opacity-[0.02] pointer-events-none"
				style={{
					backgroundImage:
						"linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
			/>
		</main>
	);
}
