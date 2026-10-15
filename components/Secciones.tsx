import RobotLogo from "./RobotLogo";

export function Problema() {
  return (
    <section className="band alt" id="problema">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">El problema</div>
          <h2>Los datos de tu empresa existen. Están repartidos en muchos lugares.</h2>
          <p className="lede">
            La diferencia entre lo planificado y lo ejecutado aparece en los costos, en las horas extra y en los atrasos,
            pero rara vez se sabe por qué pasó. Cruzar el ERP con las planillas y los registros manuales toma horas, y la
            decisión termina dependiendo de la experiencia de una persona.
          </p>
        </div>

        <div className="flow">
          <div className="sources">
            {[
              ["ERP", "Órdenes, presupuestos, compras", "valores planificados"],
              ["Excel", "Planillas de cada área", "control_semanal.xlsx"],
              ["Registros manuales", "Partes de turno, bitácoras", "horas, incidencias"],
              ["Bodega y terreno", "Salidas, despachos, avances", "valores reales"],
            ].map(([t, d, m]) => (
              <div className="src" key={t}>
                <b>{t}</b>
                <span>{d}</span>
                <span className="mono">{m}</span>
              </div>
            ))}
          </div>
          <div className="funnel">
            <span>integra y compara</span>
            <div className="arrow" />
            <div className="core">
              sof<span style={{ color: "var(--accent-on-ink)" }}>IA</span>
            </div>
            <div className="arrow" />
            <span>explica</span>
          </div>
          <div className="outs">
            <div className="out">
              <span className="mono">¿Qué se desvió más esta semana?</span>La OT-2611: +40 % en tiempo y +20 % en material.
            </div>
            <div className="out">
              <span className="mono">¿Cuánto perdimos y dónde?</span>43,7 kg de material sobre lo planificado, casi todo en
              dos órdenes.
            </div>
            <div className="out">
              <span className="mono">¿Qué revisar primero?</span>La preparación del corte en soldadura. El supervisor lo
              valida.
            </div>
          </div>
        </div>

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

const PASOS = [
  {
    n: "01",
    quien: ["log", "Usuario"],
    titulo: "Pregunta en lenguaje natural",
    texto: "Cualquier persona escribe como habla, sin fórmulas ni filtros.",
    codigo: `"¿por qué la 2611\n se pasó en material?"`,
  },
  {
    n: "02",
    quien: ["sem", "Modelo semántico"],
    titulo: "Traduce a conceptos del negocio",
    texto: "Reconoce la orden, la métrica y la intención, y las mapea a las tablas reales.",
    codigo: `intención: explicar\nentidad:   OT-2611\nmétrica:   desv_material\ncompara:   estimado / real`,
  },
  {
    n: "03",
    quien: ["log", "Motor lógico"],
    titulo: "Calcula y aplica reglas",
    texto: "Consulta la base de datos, calcula desviaciones y KPIs, y marca lo que supera el umbral.",
    codigo: `SELECT mat_est, mat_real,\n  (mat_real-mat_est)\n   /mat_est AS desv\nFROM ordenes_trabajo\nWHERE ot = 'OT-2611';\n-- desv = +20 %  ▲ crítico`,
  },
  {
    n: "04",
    quien: ["ia", "IA generativa"],
    titulo: "Explica y recomienda",
    texto: "Redacta la respuesta con las cifras del motor, propone causas probables y qué revisar.",
    codigo: `"Se usaron 20 kg más\n (+20 %). Hubo 1 reproceso;\n revisar preparación de\n corte."`,
  },
];

export function ComoFunciona() {
  return (
    <section className="band" id="como-funciona">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">Cómo funciona</div>
          <h2>De una pregunta en español a una respuesta con respaldo.</h2>
          <p className="lede">
            Cada componente hace una sola cosa. El cálculo nunca lo hace la IA: lo hace el motor lógico con reglas que se
            pueden auditar. La IA solo explica lo que el motor ya calculó.
          </p>
        </div>
        <div className="pipe">
          {PASOS.map((p) => (
            <div className="stage" key={p.n}>
              <span className="n">{p.n}</span>
              <span className={`who ${p.quien[0]}`}>{p.quien[1]}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
              <pre>{p.codigo}</pre>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const RUBROS = [
  { estado: "Caso de uso del proyecto", nombre: "Metalmecánica", ent: "orden de trabajo · kg · horas hombre", ej: "¿Por qué la OT-2611 se pasó en material?", destacado: true },
  { estado: "Configurable", nombre: "Construcción", ent: "partida · m³ · avance %", ej: "¿Qué partida se pasó del presupuesto este mes?" },
  { estado: "Configurable", nombre: "Logística y distribución", ent: "ruta · despacho · km", ej: "¿Qué ruta tuvo más atrasos esta semana?" },
  { estado: "Configurable", nombre: "Comercio y servicios", ent: "producto · venta · margen", ej: "¿Qué producto dejó menos margen en septiembre?" },
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
          {RUBROS.map((r) => (
            <article className={`rubro${r.destacado ? " destacado" : ""}`} key={r.nombre}>
              <span className="estado">{r.estado}</span>
              <h3>{r.nombre}</h3>
              <p className="ent mono">{r.ent}</p>
              <p className="ej">{r.ej}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RolIA() {
  return (
    <section className="band" id="rol-ia">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">Rol de la IA</div>
          <h2>La IA explica. Las decisiones siguen siendo de tu equipo.</h2>
        </div>
        <div className="roles">
          <div className="role si">
            <h3>Lo que sí hace</h3>
            <ul>
              <li>Explica desviaciones con las cifras que calculó el motor.</li>
              <li>Propone hipótesis de causa a partir de proceso, operario y reprocesos.</li>
              <li>Traduce datos técnicos a lenguaje simple.</li>
              <li>Responde preguntas escritas como se hablan en el trabajo.</li>
            </ul>
            <p className="foot">Cada respuesta muestra de dónde salió cada número.</p>
          </div>
          <div className="role no">
            <h3>Lo que no hace</h3>
            <ul>
              <li>Calcular consumos ni tiempos. Eso lo hace el motor lógico.</li>
              <li>Reemplazar la planificación.</li>
              <li>Tomar decisiones críticas del negocio.</li>
              <li>Dar por cierta una causa sin validación del supervisor.</li>
            </ul>
            <p className="foot">Las causas se presentan como hipótesis a validar.</p>
          </div>
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
  ["D1", "Gestora de diseño y desarrollo", "desarrollador1@gealytics.cl"],
  ["D2", "Gestor de infraestructura y desarrollo", "desarrollador2@gealytics.cl"],
  ["WS", "Wilfredo Soler Jaldin · Gestor de negocios y proyectos", "wilfredo.soler.j@gealytics.cl"],
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
        <span>Gealytics · Antofagasta, Chile · 2026</span>
      </div>
    </footer>
  );
}
