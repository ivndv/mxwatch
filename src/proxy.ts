import { type NextRequest, NextResponse } from "next/server";
import { paraglideMiddleware } from "./paraglide/server";

/**
 * Reescribe la URL pública al segmento interno [locale].
 * Paraglide delocaliza la ruta y resuelve el locale antes de reescribir.
 */
export function proxy(request: NextRequest) {
	return paraglideMiddleware(request, ({ request: req, locale }) => {
		const url = new URL(req.url);
		url.pathname = `/${locale}${url.pathname === "/" ? "" : url.pathname}`;

		const headers = new Headers(req.headers);
		headers.set("x-paraglide-locale", locale);

		return NextResponse.rewrite(url, { request: { headers } });
	});
}

export const config = {
	// Excluye API, assets de Next y archivos con extensión
	matcher: ["/((?!api|_next|.*\\..*).*)"],
};
