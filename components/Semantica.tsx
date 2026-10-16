import { ETIQUETA_TOKEN, resaltar } from "@/lib/sofia/semantico";
import type { Interpretacion } from "@/lib/sofia/tipos";

/** La pregunta con las palabras que el modelo semántico reconoció marcadas por tipo. */
export function PreguntaResaltada({ pregunta, conLeyenda = false }: { pregunta: string; conLeyenda?: boolean }) {
  const segmentos = resaltar(pregunta);
  const tipos = Array.from(new Set(segmentos.map((s) => s.tipo).filter(Boolean))) as (keyof typeof ETIQUETA_TOKEN)[];
  return (
    <div className="pr">
      <p className="pr-texto">
        {segmentos.map((s, i) =>
          s.tipo ? (
            <mark key={i} className={`tk tk-${s.tipo}`} data-tipo={ETIQUETA_TOKEN[s.tipo]}>
              {s.texto}
            </mark>
          ) : (
            <span key={i}>{s.texto}</span>
          ),
        )}
      </p>
      {conLeyenda && tipos.length > 0 && (
        <p className="pr-leyenda">
          {tipos.map((t) => (
            <span key={t} className={`ley ley-${t}`}>
              {ETIQUETA_TOKEN[t]}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

/** Chips con la interpretación del modelo semántico. */
export function ChipsInterpretacion({ i }: { i: Interpretacion }) {
  const pares = Object.entries({
    intención: i.intencion,
    entidad: i.entidad,
    métrica: i.metrica,
    ...(i.periodo ? { periodo: i.periodo } : {}),
    ...(i.extra ?? {}),
  });
  return (
    <div className="chips">
      {pares.map(([k, v]) => (
        <span className="chip" key={k}>
          <b>{k}</b> {v}
        </span>
      ))}
    </div>
  );
}

/** Convierte **texto** en <strong>. */
export function TextoRico({ texto }: { texto: string }) {
  const partes = texto.split(/\*\*(.+?)\*\*/g);
  return (
    <p>
      {partes.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>))}
    </p>
  );
}
