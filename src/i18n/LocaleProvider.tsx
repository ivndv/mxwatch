"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { Locale } from "@/paraglide/runtime";

// Locale resuelto por la ruta; lo consumen los componentes cliente
const LocaleContext = createContext<Locale>("en");

export default function LocaleProvider({
	locale,
	children,
}: {
	locale: Locale;
	children: ReactNode;
}) {
	return (
		<LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
	);
}

// Locale activo para traducir mensajes en componentes cliente
export function useLocale(): Locale {
	return useContext(LocaleContext);
}
