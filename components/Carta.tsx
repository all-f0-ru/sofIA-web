"use client";

import { useState, type ReactNode } from "react";

/** Carta de dos caras: la principal con lo no técnico; al girarla, el detalle técnico. */
export default function Carta({
  frente,
  atras,
  etiquetaFrente = "Ver detalle técnico",
  etiquetaAtras = "Volver",
}: {
  frente: ReactNode;
  atras: ReactNode;
  etiquetaFrente?: string;
  etiquetaAtras?: string;
}) {
  const [volteada, setVolteada] = useState(false);
  return (
    <div className={`carta${volteada ? " volteada" : ""}`}>
      <div className="carta-in">
        <div className="carta-cara" aria-hidden={volteada}>
          {frente}
          <button type="button" className="carta-btn" tabIndex={volteada ? -1 : 0} onClick={() => setVolteada(true)}>
            {etiquetaFrente} →
          </button>
        </div>
        <div className="carta-cara atras" aria-hidden={!volteada}>
          {atras}
          <button type="button" className="carta-btn" tabIndex={volteada ? 0 : -1} onClick={() => setVolteada(false)}>
            ← {etiquetaAtras}
          </button>
        </div>
      </div>
    </div>
  );
}
