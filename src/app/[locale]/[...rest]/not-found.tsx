import { headers } from "next/headers";
import NotFoundContent from "@/components/layout/NotFoundContent";
import { isLocale } from "@/paraglide/runtime";

// 404 del catch-all: mantiene el boundary en el segmento que lanza notFound()
export default async function NotFound() {
	const raw = (await headers()).get("x-paraglide-locale");
	const locale = raw && isLocale(raw) ? raw : "en";
	return <NotFoundContent locale={locale} />;
}
