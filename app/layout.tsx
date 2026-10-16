import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import "./interacciones.css";
import "./sofia.css";

const archivo = Archivo({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-archivo", display: "swap" });
const plex = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-plex", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "sofIA · Gealytics",
  description:
    "sofIA convierte las preguntas sobre tu negocio en respuestas claras, con los números que las respaldan. Asistente de datos con IA para MiPymes.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "sofIA · Pregúntale a tu negocio",
    description: "Asistente de datos con IA para MiPymes. Hecho por Gealytics en Antofagasta.",
    locale: "es_CL",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EEF0F4" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1116" },
  ],
};

// Aplica el tema guardado antes de pintar, para evitar el parpadeo claro/oscuro.
const scriptTema = `try{var t=localStorage.getItem("sofia-tema");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${archivo.variable} ${plex.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
