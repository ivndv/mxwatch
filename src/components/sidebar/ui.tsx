import { motion } from "framer-motion";
import React, { useState } from "react";

// Componentes atómicos reutilizables del sidebar

// Icono de búsqueda (lupa)
const SearchIcon = () => (
	<svg
		className="w-4 h-4 text-tertiary absolute left-3 top-1/2 -translate-y-1/2"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		aria-hidden="true"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
		/>
	</svg>
);

// Botón para limpiar el input de búsqueda
const ClearButton = ({ onClick }: { onClick: () => void }) => (
	<button
		type="button"
		onClick={onClick}
		className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors p-0.5"
		aria-label="Limpiar búsqueda"
	>
		<svg
			className="w-4 h-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			aria-hidden="true"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2.5}
				d="M6 18L18 6M6 6l12 12"
			/>
		</svg>
	</button>
);

// Icono de check para indicar selección
const CheckIcon = ({ color }: { color: string }) => (
	<svg
		className="w-3.5 h-3.5 flex-shrink-0"
		style={{ color }}
		fill="currentColor"
		viewBox="0 0 20 20"
		aria-hidden="true"
	>
		<path
			fillRule="evenodd"
			d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
			clipRule="evenodd"
		/>
	</svg>
);

// Tooltip de información con toggle al hacer clic/hover
const InfoTooltip = ({ content }: { content: string }) => {
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
};

// Alerta de error con botón de reintentar opcional
const ErrorAlert = ({
	message,
	onRetry,
}: {
	message: string;
	onRetry?: () => void;
}) => (
	<motion.div
		role="alert"
		initial={{ opacity: 0, y: -10 }}
		animate={{ opacity: 1, y: 0 }}
		className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center mx-4"
	>
		<span className="text-xs text-red-400">⚠️ {message}</span>
		{onRetry && (
			<button
				type="button"
				onClick={onRetry}
				className="block mx-auto mt-2 text-xs text-accent hover:text-accent-hover transition-colors"
			>
				Reintentar
			</button>
		)}
	</motion.div>
);

// Footer del panel con información de versión
const SidebarFooter = React.memo(() => (
	<div className="p-4 border-t border-white/5 mt-auto flex flex-col items-center gap-2">
		<span className="text-[10px] uppercase tracking-widest text-tertiary font-medium">
			Actualizado: Marzo 2026
		</span>
		<span className="text-[9px] text-tertiary uppercase tracking-widest opacity-40">
			Intelligence System v1.4.2
		</span>
	</div>
));
SidebarFooter.displayName = "SidebarFooter";

export {
	CheckIcon,
	ClearButton,
	ErrorAlert,
	InfoTooltip,
	SearchIcon,
	SidebarFooter,
};
