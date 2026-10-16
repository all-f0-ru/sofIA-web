import type { ReactNode } from "react";
import RobotLogo from "./RobotLogo";
import Comparador from "./Comparador";

export function Problema() {
  return (
    <section className="band alt" id="problema">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">El problema</div>
          <h2>Los datos existen. Las respuestas, no.</h2>
          <p className="lede">
            La diferencia entre lo planificado y lo ejecutado aparece en los costos, en las horas extra y en los atrasos,
            pero rara vez se sabe por qué pasó. Responderlo hoy significa cruzar el ERP con planillas y registros manuales.
            Desliza para ver la diferencia.
          </p>
        </div>

        <Comparador />

        <div className="pain">
          <div>
            <h3>Recursos de más</h3>
            <p>Materiales, insumos y mermas que nadie registra como pérdida.</p>
          </div>
          <div>
            <h3>Tiempo no planificado</h3>
            <p>Reprocesos y esperas que alargan cada trabajo y no quedan trazados.</p>
          </div>
          <div>
            <h3>Decisiones a ojo</h3>
            <p>Sin indicadores comparables entre trabajos, personas y procesos.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const ICONOS: Record<string, ReactNode> = {
  engranaje: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
    </>
  ),
  edificio: (
    <>
      <path d="M4 21V8l6-4v17M10 21V10l10 3v8M2 21h20" />
      <path d="M13.5 15h3M13.5 18h3M6.5 11h1M6.5 14h1M6.5 17h1" />
    </>
  ),
  camion: (
    <>
      <path d="M2 6h11v10H2zM13 10h4.5l3.5 3.5V16h-8" />
      <circle cx="6" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  tienda: (
    <>
      <path d="M3 9l1.8-5h14.4L21 9M3 9h18M3 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3" />
      <path d="M5 12v9h14v-9M10 21v-5h4v5" />
    </>
  ),
};

const RUBROS = [
  { estado: "Caso de uso del proyecto", nombre: "Metalmecánica", icono: "engranaje", ent: "orden de trabajo · kg · horas hombre", ej: "¿Por qué la OT-2611 se pasó en material?", destacado: true },
  { estado: "Configurable", nombre: "Construcción", icono: "edificio", ent: "partida · m³ · avance %", ej: "¿Qué partida se pasó del presupuesto este mes?" },
  { estado: "Configurable", nombre: "Logística y distribución", icono: "camion", ent: "ruta · despacho · km", ej: "¿Qué ruta tuvo más atrasos esta semana?" },
  { estado: "Configurable", nombre: "Comercio y servicios", icono: "tienda", ent: "producto · venta · margen", ej: "¿Qué producto dejó menos margen en septiembre?" },
];

export function Rubros() {
  return (
    <section className="band" id="rubros">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">Para quién</div>
          <h2>Un mismo motor, configurado para cada empresa.</h2>
          <p className="lede">
            El modelo semántico se ajusta al vocabulario de cada negocio: sus entidades, sus métricas y sus reglas. Lo que
            en un taller es una orden de trabajo, en una constructora es una partida y en una distribuidora es una ruta.
          </p>
        </div>
        <div className="rubros">
          {RUBROS.map((r) => {
            const contenido = (
              <>
                <div className="rubro-top">
                  <span className="rubro-icono" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      {ICONOS[r.icono]}
                    </svg>
                  </span>
                  <span className="estado">{r.estado}</span>
                </div>
                <h3>{r.nombre}</h3>
                <p className="ent mono">{r.ent}</p>
                <p className="ej">{r.ej}</p>
                <span className="rubro-cta">{r.destacado ? "Probar en la demo →" : "Se configura con su vocabulario"}</span>
              </>
            );
            return r.destacado ? (
              <a href="#interfaz" className="rubro destacado" key={r.nombre}>
                {contenido}
              </a>
            ) : (
              <article className="rubro" key={r.nombre}>
                {contenido}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const PRINCIPIOS: { titulo: string; texto: string; prueba: ReactNode }[] = [
  {
    titulo: "Cada número se puede repetir a mano",
    texto: "Las fórmulas son fijas y están a la vista. Si sofIA dice +20 %, cualquiera puede comprobarlo con una calculadora.",
    prueba: (
      <div className="pf-formula">
        <span>(120 − 100) ÷ 100 × 100</span>
        <b>= +20 %</b>
      </div>
    ),
  },
  {
    titulo: "La IA no calcula. Solo explica",
    texto: "El motor lógico produce las cifras. La IA generativa recibe esas cifras y las redacta; no tiene permiso para cambiarlas.",
    prueba: (
      <div className="pf-carriles">
        <div>
          <span className="who log">Motor lógico</span>
          <code>20 kg · +20 %</code>
        </div>
        <div>
          <span className="who ia">IA generativa</span>
          <code>“Se usaron 20 kg más…”</code>
        </div>
      </div>
    ),
  },
  {
    titulo: "Las causas son hipótesis",
    texto: "sofIA propone qué revisar a partir del proceso y los reprocesos registrados. La conclusión la valida tu equipo.",
    prueba: (
      <div className="pf-frases">
        <p className="no">La causa es un error del operario.</p>
        <p className="si">Lo más probable es un error en el corte. Conviene revisarlo.</p>
      </div>
    ),
  },
  {
    titulo: "No juzga personas ni inventa datos",
    texto: "Si un resultado depende de una sola orden, lo advierte. Si no entiende la pregunta, lo dice en vez de adivinar.",
    prueba: (
      <div className="pf-frases">
        <p className="si">J. Rojas queda en 81,1 %, pero el resultado depende de la OT-2611. Revisa esa orden antes de concluir.</p>
      </div>
    ),
  },
];

export function Confianza() {
  return (
    <section className="band" id="confianza">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow"><span>Por qué confiar en <span className="marca">sofIA</span></span></div>
          <h2>Una IA que muestra su trabajo.</h2>
          <p className="lede">
            En un taller, una cifra equivocada cuesta material y horas. Por eso sofIA está construida para que cada respuesta
            se pueda revisar.
          </p>
        </div>
        <div className="confianza">
          {PRINCIPIOS.map((p) => (
            <article className="confianza-card" key={p.titulo}>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
              <div className="pf">{p.prueba}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const KPIS = [
  ["Desviación de material", "(kg real − kg est) / kg est × 100", "Detecta mermas y sobreconsumo por orden."],
  ["Desviación de tiempo", "(h real − h est) / h est × 100", "Mide horas no planificadas."],
  ["Productividad por operario", "Σ h est / Σ h real", "Compara rendimiento entre operarios y procesos."],
  ["Tasa de reprocesos", "OT con reproceso / OT totales", "Mide calidad a la primera."],
  ["Eficiencia por orden", "100 − promedio(|desv mat|, |desv t|)", "Resume el desempeño de la OT en un número."],
];

export function Indicadores() {
  return (
    <section className="band alt" id="indicadores">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">Indicadores</div>
          <h2>En el caso metalmecánico: cinco KPIs, una fórmula cada uno.</h2>
          <p className="lede">
            El motor lógico calcula estos indicadores para cada orden. Las fórmulas son fijas y auditables, así el número de
            la respuesta siempre se puede reproducir a mano.
          </p>
        </div>
        <div className="tbl-wrap">
          <table className="kpi">
            <thead>
              <tr>
                <th>Indicador</th>
                <th>Fórmula</th>
                <th>Para qué sirve</th>
              </tr>
            </thead>
            <tbody>
              {KPIS.map(([k, f, u]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>
                    <code>{f}</code>
                  </td>
                  <td>{u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 14, fontSize: 13, color: "var(--muted)" }}>
          Umbrales de la demo: hasta 5 % en rango, 5–15 % atención, sobre 15 % crítico. Son parámetros que el administrador
          ajusta por proceso.
        </p>
      </div>
    </section>
  );
}

const METODO = [
  ["Levantamiento", "Observación de procesos de corte, mecanizado y soldadura y de cómo se registran hoy."],
  ["Modelo de datos", "OT, materiales, tiempos, operarios y actividades en un modelo semántico común."],
  ["Prototipo (MVP)", "Motor lógico, base de datos e IA generativa conectados en esta interfaz."],
  ["Prueba controlada", "Simulación con órdenes reales anonimizadas de un taller piloto."],
  ["Evaluación", "Tiempo para encontrar la causa y porcentaje de desviaciones bien explicadas."],
];

export function Metodologia() {
  return (
    <section className="band" id="metodologia">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">Metodología</div>
          <h2>Del caso real al prototipo evaluado.</h2>
        </div>
        <ol className="steps">
          {METODO.map(([t, d]) => (
            <li key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const EQUIPO = [
  ["D1", "Gestora de diseño y desarrollo", "boericarla@gmail.com"],
  ["D2", "Gestor de infraestructura y desarrollo", "pintoloayzamayerly@gmail.com"],
  ["WS", "Wilfredo Soler Jaldin · Gestor de negocios y proyectos", "contacto@gealytics.cl"],
];

export function Equipo() {
  return (
    <section className="band alt" id="equipo">
      <div className="wrap closing">
        <div>
          <div className="eyebrow">Equipo</div>
          <h2 style={{ marginTop: 16 }}>Hecho por Gealytics.</h2>
          <p className="lede" style={{ marginTop: 16 }}>
            Formando y Construyendo Conocimientos Ltda. desarrolla soluciones tecnológicas para la gestión de actividades en
            MiPymes de los sectores productivos. sofIA nace como nuestro proyecto de título con un primer caso de uso en
            talleres metalmecánicos, y está pensada para implementarse en empresas de distintos rubros. Nuestra meta es
            llegar al 10 % de las cerca de 21.000 MiPymes de Antofagasta.
          </p>
          <div className="feria">
            <span className="mono">Feria de proyectos · noviembre 2026</span>
            <b>Ven a nuestro stand y hazle una pregunta a sofIA en vivo.</b>
            <a href="/feria" className="feria-link">
              Abrir el modo feria →
            </a>
          </div>
        </div>
        <div className="team">
          {EQUIPO.map(([ini, rol, correo]) => (
            <div className="mem" key={correo}>
              <div className="av">{ini}</div>
              <b>{rol}</b>
              <span>{correo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <RobotLogo size={18} /> sofIA · Asistente de datos con IA para MiPymes
        </span>
        <span style={{ display: "inline-flex", gap: 16, flexWrap: "wrap" }}>
          <a href="/feria">Modo feria</a>
          <a href="https://github.com/all-f0-ru/sofIA-web">Código en GitHub</a>
          <span>Gealytics · Antofagasta, Chile · 2026</span>
        </span>
      </div>
    </footer>
  );
}
