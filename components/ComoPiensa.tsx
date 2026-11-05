"use client";

import { useState } from "react";
import { ChipsInterpretacion, PreguntaResaltada, TextoRico } from "./Semantica";
import { abrirEnDemo } from "./HeroInteractivo";
import Carta from "./Carta";
import { responderSimulado } from "@/lib/sofia/responder";

interface Caso {
  id: string;
  titulo: string;
  pregunta: string;
  /** Cómo cada expresión de la persona se traduce al esquema de datos. */
  traduccion: [string, string][];
  /** Cálculo escrito a mano para comprobar el número. */
  prueba: { formula: string; resultado: string; nota: string };
  /** Explicación no técnica del cálculo (cara principal de la carta). */
  humano: string;
}

const CASOS: Caso[] = [
  {
    id: "desviacion",
    titulo: "Explicar una desviación",
    pregunta: "¿Por qué la OT-2611 se pasó en material?",
    traduccion: [
      ["“OT-2611”", "La orden de trabajo OT-2611"],
      ["“material”", "Material gastado vs. lo planificado"],
      ["“se pasó”", "Cuánto se alejó de lo estimado"],
      ["“por qué”", "Revisa reprocesos, etapa y operario"],
    ],
    humano: "Compara el material y las horas reales de la orden con lo planificado, y revisa la etapa donde hubo reprocesos.",
    prueba:{ formula: "(120 − 100) ÷ 100 × 100", resultado: "+20 %", nota: "Material real 120 kg, estimado 100 kg." },
  },
  {
    id: "ranking",
    titulo: "Encontrar los atrasos",
    pregunta: "¿Qué órdenes se atrasaron más esta semana?",
    traduccion: [
      ["“órdenes”", "Todas las órdenes de trabajo"],
      ["“se atrasaron”", "Horas reales vs. horas planificadas"],
      ["“más”", "Las 3 con mayor atraso"],
      ["“esta semana”", "Semana 42, la actual"],
    ],
    humano: "Calcula cuánto se alargó cada orden de la semana, las ordena de mayor a menor y muestra las 3 con más atraso.",
    prueba:{ formula: "(7 − 5) ÷ 5 × 100", resultado: "+40 %", nota: "OT-2611: 7 h reales contra 5 h estimadas." },
  },
  {
    id: "mermas",
    titulo: "Sumar las pérdidas",
    pregunta: "¿Cuánto material se perdió en mermas?",
    traduccion: [
      ["“cuánto”", "Total de la suma"],
      ["“material”", "Material gastado de más en cada orden"],
      ["“se perdió”", "Solo los excesos; lo ahorrado no se resta"],
      ["(sin periodo)", "Semana actual por defecto"],
    ],
    humano: "Suma, orden por orden, solo el material que se gastó de más frente a lo planificado.",
    prueba:{ formula: "22 + 20 + 1,1 + 0,4 + 0,2", resultado: "43,7 kg", nota: "Las cinco órdenes que usaron más material del planificado." },
  },
];

export default function ComoPiensa() {
  const [activo, setActivo] = useState(CASOS[0].id);
  const [verPrueba, setVerPrueba] = useState(false);
  const caso = CASOS.find((c) => c.id === activo) ?? CASOS[0];
  const r = responderSimulado(caso.pregunta);

  return (
    <section className="band" id="como-funciona">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow"><span>Cómo piensa <span className="marca">sofIA</span></span></div>
          <h2>De cómo lo dices a cómo se calcula, sin cajas negras.</h2>
          <p className="lede">
            Un modelo semántico traduce tus palabras al lenguaje de tus datos. Un motor lógico calcula con fórmulas fijas.
            Recién entonces la IA redacta. Elige una pregunta y sigue el recorrido.
          </p>
        </div>

        <div className="casos" role="tablist" aria-label="Preguntas de ejemplo">
          {CASOS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={c.id === activo}
              className={`caso-tab${c.id === activo ? " activo" : ""}`}
              onClick={() => {
                setActivo(c.id);
                setVerPrueba(false);
              }}
            >
              {c.titulo}
            </button>
          ))}
        </div>

        <div className="recorrido" key={caso.id}>
          <article className="paso">
            <header>
              <span className="paso-n">01</span>
              <span className="who log">Persona</span>
            </header>
            <h3>Lo pregunta como lo dice</h3>
            <PreguntaResaltada pregunta={caso.pregunta} />
          </article>

          <article className="paso">
            <header>
              <span className="paso-n">02</span>
              <span className="who sem">Modelo semántico</span>
            </header>
            <h3>Lo traduce a sus datos</h3>
            <ChipsInterpretacion i={r.interpretacion} />
            <ul className="traduccion">
              {caso.traduccion.map(([de, a]) => (
                <li key={de}>
                  <span className="de">{de}</span>
                  <span className="flecha" aria-hidden="true">
                    →
                  </span>
                  <span className="a">{a}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="paso">
            <header>
              <span className="paso-n">03</span>
              <span className="who log">Motor lógico</span>
            </header>
            <h3>Lo calcula y lo prueba</h3>
            <Carta
              etiquetaFrente="Ver código técnico (SQL)"
              frente={<p>{caso.humano}</p>}
              atras={<pre>{r.sql}</pre>}
            />
            <button type="button" className="ver-prueba" aria-expanded={verPrueba} onClick={() => setVerPrueba((v) => !v)}>
              {verPrueba ? "Ocultar el cálculo" : "Ver de dónde salió el número"}
            </button>
            {verPrueba && (
              <div className="prueba">
                <div className="prueba-formula">
                  <span>{caso.prueba.formula}</span>
                  <b>= {caso.prueba.resultado}</b>
                </div>
                <div className="prueba-cota" aria-hidden="true" />
                <p>{caso.prueba.nota} Cualquiera puede repetir esta cuenta con una calculadora.</p>
              </div>
            )}
          </article>

          <article className="paso">
            <header>
              <span className="paso-n">04</span>
              <span className="who ia">IA generativa</span>
            </header>
            <h3>Lo explica en simple</h3>
            <div className="bubble">
              <TextoRico texto={r.texto} />
            </div>
            <button type="button" className="consola-link" onClick={() => abrirEnDemo(caso.pregunta)}>
              Preguntarlo en la demo →
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}
