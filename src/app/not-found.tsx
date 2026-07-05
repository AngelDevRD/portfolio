import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="section flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-8xl font-bold heading-gradient">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Página no encontrada</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        La página que buscas no existe o fue movida. Volvamos a un lugar seguro.
      </p>
      <Link href="/" className="btn-primary mt-8">
        <Home className="h-4 w-4" /> Ir al inicio
      </Link>
    </div>
  );
}
