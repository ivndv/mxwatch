import NotFoundContent from "@/components/layout/NotFoundContent";

// Fallback del segmento de idioma. El locale no está disponible aquí sin
// volver dinámico todo el segmento, así que se usa el idioma base.
export default function NotFound() {
	return <NotFoundContent locale="en" />;
}
