"use client";

import { motion } from "framer-motion";

// Alerta de error con botón de reintentar opcional
export function ErrorAlert({
	message,
	onRetry,
}: {
	message: string;
	onRetry?: () => void;
}) {
	return (
		<motion.div
			role="alert"
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-center mx-4"
		>
			<span className="text-[13px] text-secondary">⚠️ {message}</span>
			{onRetry && (
				<button
					type="button"
					onClick={onRetry}
					className="block mx-auto mt-2 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
				>
					Reintentar
				</button>
			)}
		</motion.div>
	);
}
