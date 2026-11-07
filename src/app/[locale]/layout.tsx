// biome-ignore-all lint/security/noDangerouslySetInnerHtml: tema y JSON-LD son contenido controlado

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import "../globals.css";

import Providers from "@/app/providers";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import LocaleProvider from "@/i18n/LocaleProvider";
// Traducciones y locale de la ruta
import * as m from "@/paraglide/messages";
import { isLocale, locales } from "@/paraglide/runtime";

// Tipografía principal: Geist Sans (base Vercel)
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap",
});

// Tipografía monoespaciada para cifras, fechas y coordenadas
const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	display: "swap",
});

// Ambos locales se prerenderizan
export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const l = isLocale(locale) ? locale : "en";
	const titulo =
		l === "en"
			? "mxwatch — Security map of Mexico"
			: "mxwatch — Mapa de seguridad en México";
	const descripcion =
		l === "en"
			? "Interactive platform to visualize cartel territorial control and security events across Mexico."
			: "Plataforma interactiva para visualizar el control territorial de los cárteles y eventos de seguridad en toda la República Mexicana.";

	return {
		metadataBase: new URL("https://mxwatch.liuma.app"),
		title: titulo,
		description: descripcion,
		keywords: [
			"México",
			"seguridad",
			"carteles",
			"mapa",
			"crimen organizado",
			"visualización territorial",
		],
		icons: { icon: "https://assets.liuma.app/mxwatch/favicon.png" },
		alternates: {
			canonical: l === "en" ? "/" : "/es",
			languages: { en: "/", es: "/es" },
		},
		openGraph: {
			title: "mxwatch",
			description: descripcion,
			url:
				l === "en"
					? "https://mxwatch.liuma.app/"
					: "https://mxwatch.liuma.app/es",
			siteName: "mxwatch",
			images: [
				{
					url: "https://assets.liuma.app/mxwatch/og-image.png",
					width: 1200,
					height: 630,
				},
			],
			locale: l === "en" ? "en_US" : "es_MX",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: titulo,
			description: descripcion,
			creator: "@mxwatch",
			images: ["https://assets.liuma.app/mxwatch/og-image.png"],
		},
	};
}

// Layout raíz localizado: documento HTML, fuentes y estructura persistente
export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();

	// Datos estructurados para buscadores
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name: "mxwatch",
		description: m.landing_subtitle({}, { locale }),
		url:
			locale === "en"
				? "https://mxwatch.liuma.app/"
				: "https://mxwatch.liuma.app/es",
		applicationCategory: "PublicInformation",
		genre: "Security & Analysis",
		browserRequirements: "Requires JavaScript",
		operatingSystem: "All",
	};

	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>

				{/* Analytics respetuoso con la privacidad (Umami) */}
				<Script
					src="https://umami.liuma.app/script.js"
					data-website-id="7d9d6a44-ae40-4784-894d-0509fda3ac05"
					strategy="afterInteractive"
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-dvh`}
			>
				<Providers>
					<LocaleProvider locale={locale}>
						<a
							href="#main-content"
							className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-card focus:text-primary focus:rounded-lg focus:border focus:border-border focus:shadow-float"
						>
							{m.a11y_skip({}, { locale })}
						</a>
						<Navbar />
						{/* Contenedor principal con offset para navbar fijo */}
						<main
							id="main-content"
							className="flex-1 w-full pt-[calc(64px+env(safe-area-inset-top))]"
						>
							{children}
						</main>
						<Footer />
					</LocaleProvider>
				</Providers>
				<Script
					src="https://static.cloudflareinsights.com/beacon.min.js"
					data-cf-beacon='{"token":"d6746ded70f946509cb9e045788037e7"}'
					strategy="afterInteractive"
				/>
			</body>
		</html>
	);
}
