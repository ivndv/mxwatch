"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";
import { localizeHref } from "@/paraglide/runtime";

/**
 * Página de inicio: propuesta de valor, métricas clave y acceso al mapa.
 */
export default function Home() {
	const locale = useLocale();

	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.08, delayChildren: 0.05 },
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 12 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
		},
	};

	// Métricas de cobertura mostradas en la landing
	const kpis = [
		{ label: m.landing_kpi_cartels({}, { locale }), value: "5" },
		{ label: m.landing_kpi_states({}, { locale }), value: "32" },
		{ label: m.landing_kpi_events({}, { locale }), value: "0" },
	];

	return (
		<main className="relative w-full min-h-[calc(100dvh-64px)] flex items-center justify-center overflow-hidden px-6 py-24">
			{/* Retícula de puntos con desvanecido radial */}
			<div
				className="absolute inset-0 bg-dots pointer-events-none"
				aria-hidden
			/>

			<motion.div
				className="relative w-full max-w-3xl mx-auto flex flex-col items-center text-center"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				{/* Kicker con líneas de acento */}
				<motion.div
					variants={itemVariants}
					className="flex items-center justify-center gap-3"
				>
					<span className="h-px w-8 bg-accent/70" aria-hidden="true" />
					<span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-tertiary">
						MXWATCH
					</span>
					<span className="h-px w-8 bg-accent/70" aria-hidden="true" />
				</motion.div>

				{/* Título con una sola palabra en acento */}
				<motion.h1
					variants={itemVariants}
					className="mt-7 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-balance text-primary leading-[1.05]"
				>
					{m.landing_title_1({}, { locale })}{" "}
					<span className="text-accent">
						{m.landing_title_2({}, { locale })}
					</span>
				</motion.h1>

				<motion.p
					variants={itemVariants}
					className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-secondary"
				>
					{m.landing_subtitle({}, { locale })}
				</motion.p>

				{/* Llamada a la acción principal */}
				<motion.div variants={itemVariants} className="mt-10">
					<Link
						href={localizeHref("/map", { locale })}
						className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold text-white transition-colors hover:bg-accent-hover shadow-card"
					>
						<span>{m.landing_cta({}, { locale })}</span>
						<svg
							className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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

				{/* Métricas como tira con divisores */}
				<motion.ul
					variants={itemVariants}
					className="mt-16 w-full max-w-xl grid grid-cols-3 divide-x divide-border-subtle"
				>
					{kpis.map(({ label, value }) => (
						<li
							key={label}
							className="flex flex-col items-center justify-center gap-1.5 px-3 sm:px-6"
						>
							<span className="font-mono text-2xl sm:text-3xl font-medium tracking-tight text-primary tabular-nums">
								{value}
							</span>
							<span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] text-tertiary text-center leading-snug">
								{label}
							</span>
						</li>
					))}
				</motion.ul>
			</motion.div>
		</main>
	);
}
