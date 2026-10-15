import { desviacion, nivel, num, pct } from "@/lib/sofia/motor";
import type { CotaDato } from "@/lib/sofia/tipos";

/**
 * Cota: compara lo estimado con lo real como una cota de plano.
 * La línea con topes marca lo estimado; la barra tintada, lo real.
 */
export default function Cota({ etiqueta, estimado, real, unidad }: CotaDato) {
  const max = Math.max(estimado, real) * 1.08;
  const d = desviacion(estimado, real);
  const n = nivel(d);
  return (
    <div className="cota">
      <div className="cota-head">
        <span>{etiqueta}</span>
        <span className={n}>{pct(d)}</span>
      </div>
      <div className="cota-track" aria-hidden="true">
        <div className="cota-line" style={{ left: 0, width: `${(estimado / max) * 100}%` }} />
        <div className={`cota-real bg-${n}`} style={{ left: 0, width: `${(real / max) * 100}%`, opacity: 0.28 }} />
      </div>
      <div className="cota-legend">
        <span>
          est. {num(estimado)} {unidad}
        </span>
        <span>
          real {num(real)} {unidad}
        </span>
      </div>
    </div>
  );
}
