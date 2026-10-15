import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import DemoApp from "@/components/demo/DemoApp";
import {
  ComoFunciona,
  Equipo,
  Footer,
  Indicadores,
  Metodologia,
  Problema,
  RolIA,
  Rubros,
} from "@/components/Secciones";

export default function Inicio() {
  return (
    <>
      <Nav />
      <main id="contenido">
        <Hero />
        <Problema />
        <ComoFunciona />
        <Rubros />
        <section className="band alt" id="interfaz">
          <div className="wrap">
            <div className="head">
              <div className="eyebrow">Caso de uso · metalmecánica · demo interactiva</div>
              <h2>Así la usa un supervisor de producción.</h2>
              <p className="lede">
                A la izquierda, las órdenes de la semana con su estado. Al centro, la conversación. A la derecha, el
                inspector muestra cómo se transformó la pregunta en cada paso. Prueba una sugerencia, toca una OT o
                escribe tu propia pregunta.
              </p>
            </div>
            <DemoApp />
          </div>
        </section>
        <RolIA />
        <Indicadores />
        <Metodologia />
        <Equipo />
      </main>
      <Footer />
    </>
  );
}
