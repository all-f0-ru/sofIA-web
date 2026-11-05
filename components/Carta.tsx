"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * Carta de dos caras. La cara principal muestra la explicación no técnica;
 * al hacer clic en cualquier parte de la tarjeta gira y aparece el detalle técnico.
 */
export default function Carta({
  frente,
  atras,
  etiquetaFrente = "Ver detalle técnico",
  tituloAtras = "Detalle técnico",
}: {
  frente: ReactNode;
  atras: ReactNode;
  etiquetaFrente?: string;
  tituloAtras?: string;
}) {
  const [volteada, setVolteada] = useState(false);
  const girar = () => setVolteada((v) => !v);
  const alTeclear = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      girar();
    }
  };
  return (
    <div
      className={`carta${volteada ? " volteada" : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={volteada}
      onClick={girar}
      onKeyDown={alTeclear}
    >
      <div className="carta-in">
        <div className="carta-cara" aria-hidden={volteada}>
          <div className="carta-cuerpo">{frente}</div>
          <span className="carta-pista">{etiquetaFrente} ↻</span>
        </div>
        <div className="carta-cara atras" aria-hidden={!volteada}>
          <span className="carta-titulo">{tituloAtras}</span>
          <div className="carta-cuerpo">{atras}</div>
          <span className="carta-pista">↺ Volver a la explicación</span>
        </div>
      </div>
    </div>
  );
}
