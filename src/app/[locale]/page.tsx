"use client";

// Animaciones
import { motion, type Variants } from "framer-motion";
// Navegación
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import { localizeHref } from "@/paraglide/runtime";

/**
 * Página de inicio (Landing): presenta la propuesta de valor y métricas clave.
 * Sirve como punto de entrada principal hacia el mapa interactivo.
 */
export default function Home() {
	const locale = useLocale();

	// Variantes para animaciones escalonadas
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.1,
			},
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 15 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: [0.25, 0.1, 0.25, 1.0],
			},
		},
	};

	// Métricas de cobertura mostradas en la landing
	const kpis = [
		{ label: m.landing_kpi_cartels({}, { locale }), value: "5" },
		{ label: m.landing_kpi_states({}, { locale }), value: "32" },
		{
			label: m.landing_kpi_events({}, { locale }),
			value: "0",
			highlight: false,
		},
	];

	return (
		<main className="relative w-full flex flex-col items-center justify-center min-h-[calc(100dvh-64px)] px-8 text-center py-20 overflow-hidden">
			<motion.div
				className="w-full max-w-6xl mx-auto flex flex-col items-center"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				{/* Efectos de iluminación de fondo (Glow) con animación suave */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.03 }}
					transition={{ duration: 2 }}
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square pointer-events-none rounded-full bg-primary blur-3xl z-[-1]"
				/>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.06 }}
					transition={{ duration: 1.5, delay: 0.5 }}
					className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent blur-[120px] pointer-events-none rounded-full z-[-1]"
				/>

				{/* Encabezado principal con jerarquía visual y gradiente de acento */}
				<motion.h1
					variants={itemVariants}
					className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl text-primary"
				>
					{m.landing_title_1({}, { locale })} <br className="hidden sm:block" />
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#f47e86]">
						{m.landing_title_2({}, { locale })}
					</span>
				</motion.h1>

				<motion.p
					variants={itemVariants}
					className="mt-5 max-w-xl text-base leading-relaxed text-secondary sm:text-lg"
				>
					{m.landing_subtitle({}, { locale })}
				</motion.p>

				{/* Rejilla de estadísticas rápidas (KPIs) del sistema */}
				<motion.ul
					variants={itemVariants}
					className="mt-14 w-full max-w-2xl grid grid-cols-2 gap-3 sm:grid-cols-3"
				>
					<h2 className="sr-only">{m.landing_kpi_cartels({}, { locale })}</h2>
					{kpis.map(({ label, value, highlight = true }) => (
						<li
							key={label}
							className={`flex flex-col items-center justify-center gap-1 rounded-xl border ${highlight ? "border-border-subtle bg-card shadow-sm" : "border-border-subtle bg-surface opacity-60"} p-4 transition-colors hover:bg-hover backdrop-blur-sm`}
						>
							<span className="text-2xl font-bold tracking-tight text-primary">
								{value}
							</span>
							<span className="text-xs font-medium text-secondary text-center">
								{label}
							</span>
						</li>
					))}
				</motion.ul>

				{/* Llamada a la acción (CTA) principal hacia el mapa */}
				<motion.div
					variants={itemVariants}
					className="mt-14 flex flex-col sm:flex-row gap-4"
				>
					<Link
						href={localizeHref("/map", { locale })}
						className="group relative inline-flex h-11 md:h-12 items-center justify-center rounded-lg bg-accent px-6 text-sm font-semibold text-white transition-all hover:bg-accent-hover hover:-translate-y-0.5 shadow-[0_0_30px_-10px_var(--accent-glow)]"
					>
						<span>{m.landing_cta({}, { locale })}</span>
						<svg
							className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</Link>
				</motion.div>
			</motion.div>
		</main>
	);
}
