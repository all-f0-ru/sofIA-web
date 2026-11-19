"use client";

import { useEffect, useState } from "react";
import DemoApp from "./DemoApp";
import SofiaAgente from "./SofiaAgente";

type Modo = "demo" | "agente";

const estiloInactiva = {
  background: "transparent",
  color: "inherit",
  border: "1px solid var(--muted)",
  borderRadius: 999,
  padding: "8px 16px",
  cursor: "pointer",
  font: "inherit",
} as const;

/** Muestra la demo guiada y el agente real de n8n como dos pestañas de la sección Demo. */
export default function DemoConAgente() {
  const [modo, setModo] = useState<Modo>("demo");
  const [agenteAbierto, setAgenteAbierto] = useState(false);

  // Si la portada o "Cómo piensa" piden una pregunta, se vuelve a la demo guiada.
  useEffect(() => {
    const alPedir = () => setModo("demo");
    window.addEventListener("sofia:preguntar", alPedir);
    return () => window.removeEventListener("sofia:preguntar", alPedir);
  }, []);

  function elegir(m: Modo) {
    setModo(m);
    if (m === "agente") setAgenteAbierto(true);
  }

  const pestana = (m: Modo, texto: string) => (
    <button
      type="button"
      role="tab"
      id={`pestana-${m}`}
      aria-selected={modo === m}
      aria-controls={`panel-${m}`}
      className={modo === m ? "btn" : undefined}
      style={modo === m ? undefined : estiloInactiva}
      onClick={() => elegir(m)}
    >
      {texto}
    </button>
  );

  return (
    <div>
      <div role="tablist" aria-label="Modo de la demo" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        {pestana("demo", "Demo guiada (datos de ejemplo)")}
        {pestana("agente", "Agente en vivo")}
      </div>

      {/* Ambos paneles quedan montados para no perder la conversación ni los eventos de la demo. */}
      <div role="tabpanel" id="panel-demo" aria-labelledby="pestana-demo" hidden={modo !== "demo"}>
        <DemoApp />
      </div>

      <div role="tabpanel" id="panel-agente" aria-labelledby="pestana-agente" hidden={modo !== "agente"}>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 12px" }}>
          Agente conectado a los registros reales de mantenimiento. Requiere código de acceso.
        </p>
        {agenteAbierto && <SofiaAgente />}
      </div>
    </div>
  );
}
