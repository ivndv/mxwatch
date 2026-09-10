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
}
