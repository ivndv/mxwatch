import type { Metadata } from "next";
import * as m from "@/paraglide/messages";
import { isLocale } from "@/paraglide/runtime";

// Metadatos SEO localizados
export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const l = isLocale(locale) ? locale : "en";
	return {
		title: `${m.privacy_title({}, { locale: l })} — mxwatch`,
		description: m.privacy_meta_description({}, { locale: l }),
	};
}

/**
 * Página estática de Política de Privacidad.
 * Detalla el compromiso de no-recopilación de PII y el uso ético de analíticas.
 */
export default async function PrivacyPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const l = isLocale(locale) ? locale : "en";

	const secciones = [
		{
			titulo: m.privacy_s1_title({}, { locale: l }),
			cuerpo: m.privacy_s1_body({}, { locale: l }),
		},
		{
			titulo: m.privacy_s2_title({}, { locale: l }),
			cuerpo: m.privacy_s2_body({}, { locale: l }),
		},
		{
			titulo: m.privacy_s3_title({}, { locale: l }),
			cuerpo: m.privacy_s3_body({}, { locale: l }),
		},
		{
			titulo: m.privacy_s4_title({}, { locale: l }),
			cuerpo: m.privacy_s4_body({}, { locale: l }),
		},
		{
			titulo: m.privacy_s5_title({}, { locale: l }),
			cuerpo: m.privacy_s5_body({}, { locale: l }),
		},
	];

	return (
		<article className="max-w-3xl mx-auto px-4 py-16 sm:py-20 text-secondary leading-relaxed">
			<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-primary mb-2">
				{m.privacy_title({}, { locale: l })}
			</h1>
			<p className="text-xs font-mono text-tertiary mb-10">
				{m.legal_updated({}, { locale: l })}
			</p>

			{secciones.map(({ titulo, cuerpo }) => (
				<section key={titulo} className="mb-9">
					<h2 className="text-lg font-semibold tracking-tight text-primary mb-2.5">
						{titulo}
					</h2>
					<p className="text-[15px] leading-relaxed">{cuerpo}</p>
				</section>
			))}

			<div className="mt-20 pt-8 border-t border-border-subtle text-center">
				<p className="text-sm">{m.privacy_footer({}, { locale: l })}</p>
			</div>
		</article>
	);
}
