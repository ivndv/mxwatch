"use client";

import { useState } from "react";

// Tooltip de información con toggle al hacer clic o hover
export function InfoTooltip({ content }: { content: string }) {
	const [abierto, setAbierto] = useState(false);
	return (
		<button
			type="button"
			className="group relative inline-flex items-center ml-1"
			onClick={() => setAbierto((p) => !p)}
			onMouseEnter={() => setAbierto(true)}
			onMouseLeave={() => setAbierto(false)}
		>
			<span className="text-tertiary cursor-help text-xs">ⓘ</span>
			<div
				className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-card border border-white/10 rounded-lg text-[10px] text-secondary transition-opacity pointer-events-none z-50 ${abierto ? "opacity-100" : "opacity-0"}`}
			>
				{content}
			</div>
		</button>
	);
}
