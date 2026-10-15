import Cota from "./Cota";
import { ORDENES } from "@/lib/sofia/datos";

export default function Hero() {
  const ot = ORDENES.find((o) => o.id === "OT-2611")!;
  return (
    <header className="hero" id="inicio">
      <div className="wrap">
        <div>
          <div className="eyebrow">Asistente de datos con IA para MiPymes</div>
          <h1>
            Pregúntale a tu negocio. <em>Te responde</em> con números y razones.
          </h1>
          <p className="lede">
            sofIA compara lo planificado con lo real en tu empresa. Un modelo semántico entiende la pregunta, el motor
            lógico hace los cálculos y la IA generativa explica el resultado en lenguaje simple.
          </p>
          <div className="cta">
            <a className="btn" href="#interfaz">
              Probar la demo
            </a>
            <a className="btn ghost" href="#como-funciona">
              Ver cómo funciona
            </a>
          </div>
          <p className="tag">
            <span className="dot" />
            Caso piloto: talleres metalmecánicos de Antofagasta
          </p>
        </div>

        <figure className="ficha" style={{ margin: 0 }} aria-label="Ejemplo de consulta y respuesta">
          <div className="ficha-top">
            <span>
              {ot.id} · {ot.pieza} · {ot.proceso}
            </span>
            <span>Caso metalmecánica</span>
          </div>
          <div className="ficha-body">
            <div className="q">¿Por qué la {ot.id} se pasó en material?</div>
            <div>
              <div className="step-lbl">1 · El modelo semántico entendió</div>
              <div className="chips">
                <span className="chip">
                  <b>intención</b> explicar_desviación
                </span>
                <span className="chip">
                  <b>OT</b> 2611
                </span>
                <span className="chip">
                  <b>métrica</b> material_kg
                </span>
              </div>
            </div>
            <div>
              <div className="step-lbl">2 · El motor lógico calculó</div>
              <div style={{ display: "grid", gap: 10 }}>
                <Cota etiqueta="Material" estimado={ot.matEst} real={ot.matReal} unidad="kg" />
                <Cota etiqueta="Tiempo" estimado={ot.tEst} real={ot.tReal} unidad="h" />
              </div>
            </div>
            <div>
              <div className="step-lbl">3 · La IA lo explica</div>
              <div className="a">
                Se usaron <strong>20 kg más</strong> de lo planificado (+20 %) y la orden tardó <strong>2 horas más</strong>{" "}
                (+40 %). Hubo 1 reproceso de soldadura, así que lo más probable es un error en el corte inicial o en la
                preparación de biseles. Conviene revisar esa etapa antes de la próxima OT similar.
              </div>
            </div>
          </div>
        </figure>
      </div>
    </header>
  );
}
