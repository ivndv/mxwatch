"use client";

import { useEffect } from "react";
import { resolverTema, useThemeStore } from "@/store/themeStore";

/**
 * Aplica el tema activo al documento y escucha cambios del sistema.
 * No renderiza nada: el script del layout ya evitó el flash inicial.
 */
export default function ThemeSync() {
	const tema = useThemeStore((s) => s.tema);

	useEffect(() => {
		const aplicar = () => {
			document.documentElement.dataset.theme = resolverTema(tema);
		};

		aplicar();

		// En modo "system" se reacciona al cambio de preferencia del SO
		if (tema !== "system") return;

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		media.addEventListener("change", aplicar);
		return () => media.removeEventListener("change", aplicar);
	}, [tema]);

	return null;
}
