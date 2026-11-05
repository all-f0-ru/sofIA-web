"use client";

import { useCallback, useEffect, useState } from "react";
import CodigoQR, { URL_SITIO } from "./CodigoQR";
import RobotLogo from "./RobotLogo";
import { ChipsInterpretacion, PreguntaResaltada, TextoRico } from "./Semantica";
import { EJEMPLOS } from "@/lib/sofia/semantico";
import { responderSimulado } from "@/lib/sofia/responder";

const MS_POR_PREGUNTA = 11000;

/**
 * Pantalla para el stand de la feria: preguntas que rotan solas, el análisis paso a paso
 * y un QR grande para abrir el sitio en el celular.
 * Teclado: ← → cambian de pregunta, espacio pausa, F pantalla completa.
 */
export default function ModoFeria() {
  const [i, setI] = useState(0);
  const [fase, setFase] = useState(4);
  const [pausa, setPausa] = useState(false);
  const pregunta = EJEMPLOS[i];
  const r = responderSimulado(pregunta);

  const ir = useCallback((delta: number) => setI((x) => (x + delta + EJEMPLOS.length) % EJEMPLOS.length), []);

  // Revela los pasos uno a uno cada vez que cambia la pregunta.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFase(4);
      return;
    }
    setFase(0);
    const tiempos = [500, 1600, 2900, 4300].map((ms, n) => window.setTimeout(() => setFase(n + 1), ms));
    return () => tiempos.forEach((t) => window.clearTimeout(t));
  }, [i]);

  // Avance automático.
  useEffect(() => {
    if (pausa) return;
    const t = window.setTimeout(() => ir(1), MS_POR_PREGUNTA);
    return () => window.clearTimeout(t);
  }, [i, pausa, ir]);

  const pantallaCompleta = useCallback(() => {
    const el = document.documentElement;
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void el.requestFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") ir(1);
      else if (e.key === "ArrowLeft") ir(-1);
      else if (e.key === " ") {
        e.preventDefault();
        setPausa((p) => !p);
      } else if (e.key.toLowerCase() === "f") pantallaCompleta();
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [ir, pantallaCompleta]);

  return (
    <main className="modo-feria">
      <div className="mf-grid">
        <section className="mf-izq">
          <div className="mf-marca">
            <RobotLogo size={64} />
            <span>
              sof<em>IA</em>
            </span>
          </div>
          <h1>Pregúntale a tu negocio.</h1>

          <div className="mf-pregunta" key={`q-${i}`}>
            <span className="mf-lbl">Pregunta</span>
            <PreguntaResaltada pregunta={pregunta} />
          </div>

          <div className="mf-pasos">
            <div className={`mf-paso${fase >= 1 ? " on" : ""}`}>
              <span className="mf-lbl">1 · Lo que entendió el modelo semántico</span>
              {fase >= 1 && <ChipsInterpretacion i={r.interpretacion} />}
            </div>
            <div className={`mf-paso${fase >= 2 ? " on" : ""}`}>
              <span className="mf-lbl">2 · Lo que calculó el motor lógico</span>
              {fase >= 2 && (
                <div className="mf-calculo">
                  {r.calculo.slice(0, 4).map((f) => (
                    <span key={f.etiqueta}>
                      {f.etiqueta} <b className={f.nivel}>{f.valor}</b>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className={`mf-paso grande${fase >= 3 ? " on" : ""}`}>
              <span className="mf-lbl">3 · Lo que explica la IA</span>
              {fase >= 3 && (
                <div className="bubble">
                  <TextoRico texto={r.texto} />
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="mf-der">
          <div className="mf-qr">
            <CodigoQR size={280} />
          </div>
          <p className="mf-qr-texto">Escanea y pruébala en tu celular</p>
          <p className="mf-url">{URL_SITIO.replace("https://", "")}</p>
          <div className="mf-puntos" role="tablist" aria-label="Preguntas">
            {EJEMPLOS.map((q, n) => (
              <button
                key={q}
                type="button"
                role="tab"
                aria-selected={n === i}
                aria-label={q}
                className={n === i ? "on" : undefined}
                onClick={() => setI(n)}
              />
            ))}
          </div>
          <div className="mf-controles">
            <button type="button" onClick={() => setPausa((p) => !p)}>
              {pausa ? "Reanudar" : "Pausar"}
            </button>
            <button type="button" onClick={pantallaCompleta}>
              Pantalla completa
            </button>
            <a href="/">Volver al sitio</a>
          </div>
          <p className="mf-pie">Gealytics · Feria de proyectos · noviembre 2026</p>
        </aside>
      </div>
    </main>
  );
}
