"use client";

import { useEffect } from "react";

/**
 * Efectos de interacción que necesitan JavaScript:
 * 1. Las secciones que están fuera de pantalla aparecen suavemente al hacer scroll.
 * 2. En la portada, una luz cobalto sigue al cursor.
 * 3. Las tarjetas de rubros se inclinan levemente hacia el cursor.
 * Todo se desactiva si el usuario pidió reducir el movimiento.
 */
const SELECTOR_APARICION = [
  ".band .head",
  ".rubro",
  ".paso",
  ".comparador",
  ".confianza-card",
  ".pain > div",
  ".role",
  ".steps li",
  ".mem",
  ".feria",
  ".app",
  ".tbl-wrap",
].join(",");

export default function Efectos() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const limpiezas: (() => void)[] = [];

    // 1. Aparición al hacer scroll (solo lo que todavía no se ve, así la primera vista queda completa)
    const elementos = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR_APARICION));
    const alto = window.innerHeight;
    const pendientes = elementos.filter((el) => el.getBoundingClientRect().top > alto * 0.92);
    pendientes.forEach((el) => {
      const hermanos = el.parentElement ? Array.from(el.parentElement.children) : [];
      const i = Math.max(0, hermanos.indexOf(el));
      el.style.setProperty("--rv-delay", `${Math.min(i, 5) * 70}ms`);
      el.classList.add("rv");
    });
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.classList.add("rv-in");
            observador.unobserve(el);
            // Al terminar, se quitan las clases para que vuelvan las transiciones propias del elemento (hover, etc.)
            window.setTimeout(() => el.classList.remove("rv", "rv-in"), 1200);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    pendientes.forEach((el) => observador.observe(el));
    limpiezas.push(() => observador.disconnect());

    // 2. Luz que sigue al cursor en la portada
    const hero = document.querySelector<HTMLElement>(".hero");
    if (hero) {
      const mover = (ev: PointerEvent) => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", `${ev.clientX - r.left}px`);
        hero.style.setProperty("--my", `${ev.clientY - r.top}px`);
        hero.classList.add("con-luz");
      };
      const salir = () => hero.classList.remove("con-luz");
      hero.addEventListener("pointermove", mover);
      hero.addEventListener("pointerleave", salir);
      limpiezas.push(() => {
        hero.removeEventListener("pointermove", mover);
        hero.removeEventListener("pointerleave", salir);
      });
    }

    // 3. Inclinación 3D de las tarjetas de rubros
    document.querySelectorAll<HTMLElement>(".rubro").forEach((card) => {
      const mover = (ev: PointerEvent) => {
        if (ev.pointerType !== "mouse") return;
        const r = card.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - 0.5;
        const y = (ev.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
        card.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
        card.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
      };
      const salir = () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      };
      card.addEventListener("pointermove", mover);
      card.addEventListener("pointerleave", salir);
      limpiezas.push(() => {
        card.removeEventListener("pointermove", mover);
        card.removeEventListener("pointerleave", salir);
      });
    });

    return () => limpiezas.forEach((f) => f());
  }, []);

  return null;
}
