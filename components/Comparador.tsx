"use client";

import { useState } from "react";
import Cota from "./Cota";
import RobotLogo from "./RobotLogo";

/** Planilla típica: datos cruzados a mano, celdas con errores y notas sueltas. */
const COLUMNAS = ["A", "B", "C", "D", "E", "F", "G"];
const FILAS: { celdas: string[]; marca?: number[]; error?: number[] }[] = [
  { celdas: ["OT", "Pieza", "Mat. est", "Mat. real", "Desv %", "H est", "Obs."] },
  { celdas: ["2604", "Eje SAE 1045", "42", "43,1", "2,6", "6", ""] },
  { celdas: ["2607", "Brida 6\"", "18", "18.4", "#¡VALOR!", "3", "punto o coma??"], error: [4] },
  { celdas: ["2611", "Bastidor", "100", "120", "", "5", "ver con Juan"], marca: [3, 6] },
  { celdas: ["2615", "Planchas A36", "380", "402", "#¡DIV/0!", "", "falta parte turno"], error: [4], marca: [5] },
  { celdas: ["2618", "Sop. bomba", "64", "63", "-1,6", "8", ""] },
  { celdas: ["2620", "Pasador Ø25", "12", "?", "", "4", "bodega no informó"], marca: [3] },
  { celdas: ["", "", "", "", "", "", ""] },
  { celdas: ["TOTAL", "", "=SUMA(C2:C7)", "#¡REF!", "", "", ""], error: [3] },
];

export default function Comparador() {
  const [pos, setPos] = useState(52);

  return (
    <div className="comparador" style={{ ["--pos" as string]: `${pos}%` }}>
      <div className="cmp-capa cmp-sin" aria-hidden={pos < 8}>
        <span className="cmp-etiqueta">Sin <span className="marca">sofIA</span><span className="cmp-archivo"> · control_semanal_v3_FINAL.xlsx</span></span>
        <div className="planilla-wrap">
          <table className="planilla">
            <thead>
              <tr>
                <th />
                {COLUMNAS.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FILAS.map((f, i) => (
                <tr key={i} className={i === 0 ? "enc" : undefined}>
                  <th>{i + 1}</th>
                  {f.celdas.map((c, j) => (
                    <td key={j} className={f.error?.includes(j) ? "err" : f.marca?.includes(j) ? "mrc" : undefined}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <span className="nota-suelta n1">¿Quién cargó la OT-2615?</span>
        <span className="nota-suelta n2">Cruzar con ERP el lunes</span>
      </div>

      <div className="cmp-capa cmp-con" aria-hidden={pos > 92}>
        <span className="cmp-etiqueta con">Con <span className="marca">sofIA</span> · una pregunta</span>
        <div className="cmp-respuesta">
          <div className="msg-u">¿Qué orden se desvió más esta semana y por qué?</div>
          <div className="msg-a">
            <span className="who" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <RobotLogo size={16} />
              sofIA
            </span>
            <div className="bubble">
              <p>
                La <strong>OT-2611</strong>: usó <strong>20 kg más</strong> de material (+20 %) y tardó{" "}
                <strong>2 h más</strong> (+40 %). Tuvo un reproceso de soldadura; lo más probable es un error en el corte
                inicial.
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                <Cota etiqueta="Material" estimado={100} real={120} unidad="kg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cmp-manilla" aria-hidden="true">
        <span>‹ ›</span>
      </div>
      <label htmlFor="cmp-rango" className="sr-only">
        Deslizar para comparar la planilla sin sofIA con la respuesta de sofIA
      </label>
      <input
        id="cmp-rango"
        className="cmp-rango"
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
      />
    </div>
  );
}
