// Icono de búsqueda (lupa)
export const SearchIcon = () => (
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
export const ClearButton = ({ onClick }: { onClick: () => void }) => (
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
export const CheckIcon = ({ color }: { color: string }) => (
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
