import type { Metadata } from "next";
import ModoFeria from "@/components/ModoFeria";

export const metadata: Metadata = {
  title: "sofIA · Modo feria",
  description: "Pantalla de presentación de sofIA para el stand de la feria de proyectos.",
};

export default function PaginaFeria() {
  return <ModoFeria />;
}
