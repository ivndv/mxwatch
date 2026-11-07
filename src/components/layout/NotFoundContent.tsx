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
		<main className="relative w-full flex flex-col items-center justify-center min-h-[calc(100dvh-64px)] px-6 text-center py-24 overflow-hidden bg-surface">
			{/* Retícula de puntos con desvanecido radial */}
			<div
				className="absolute inset-0 bg-dots pointer-events-none"
				aria-hidden
			/>

			<div className="relative z-10 flex flex-col items-center">
				{/* Badge de estado: notificación de error */}
				<div
					role="alert"
					className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-elevated px-4 py-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase text-tertiary"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-accent" />
					{m.notfound_badge({}, { locale })}
				</div>

				{/* Mensaje principal con temática de cobertura */}
				<h1 className="max-w-4xl text-4xl font-semibold tracking-tighter sm:text-6xl text-primary leading-[1.05] text-balance">
					{m.notfound_title_1({}, { locale })}{" "}
					<span className="text-accent">
						{m.notfound_title_2({}, { locale })}
					</span>
				</h1>

				<p className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-secondary">
					{m.notfound_body({}, { locale })}
				</p>

				{/* Opciones de navegación: inicio o mapa */}
				<div className="mt-10 flex flex-col sm:flex-row gap-3">
					<Link
						href={localizeHref("/", { locale })}
						className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold text-white transition-colors hover:bg-accent-hover shadow-card"
					>
						<svg
							className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
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
						className="inline-flex h-12 items-center justify-center rounded-full border border-border-subtle bg-elevated px-7 text-sm font-medium text-primary transition-colors hover:bg-hover"
					>
						{m.notfound_map({}, { locale })}
					</Link>
				</div>
			</div>
		</main>
	);
}
