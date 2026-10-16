import Nav from "@/components/Nav";
import HeroInteractivo from "@/components/HeroInteractivo";
import ComoPiensa from "@/components/ComoPiensa";
import DemoApp from "@/components/demo/DemoApp";
import Efectos from "@/components/Efectos";
import { Confianza, Equipo, Footer, Indicadores, Metodologia, Problema, Rubros } from "@/components/Secciones";

export default function Inicio() {
  return (
    <>
      <Nav />
      <main id="contenido">
        <HeroInteractivo />
        <Problema />
        <ComoPiensa />
        <Confianza />
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
        <Indicadores />
        <Metodologia />
        <Equipo />
      </main>
      <Footer />
      <Efectos />
    </>
  );
}
