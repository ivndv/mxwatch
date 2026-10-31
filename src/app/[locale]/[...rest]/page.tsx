import { notFound } from "next/navigation";

// Cualquier ruta no reconocida dentro del locale cae en el 404 localizado
export default function CatchAllPage() {
	notFound();
}
