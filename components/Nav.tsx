"use client";

import { useEffect, useState } from "react";
import RobotLogo from "./RobotLogo";

const ENLACES = [
  { href: "#como-funciona", texto: "Cómo piensa" },
  { href: "#confianza", texto: "Confianza" },
  { href: "#rubros", texto: "Rubros" },
  { href: "#interfaz", texto: "Demo" },
  { href: "#equipo", texto: "Equipo" },
];

function temaActual(): "light" | "dark" {
  const t = document.documentElement.dataset.theme;
  if (t === "light" || t === "dark") return t;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function Nav() {
  const [oscuro, setOscuro] = useState(false);

  useEffect(() => {
    setOscuro(temaActual() === "dark");
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const alCambiar = () => setOscuro(temaActual() === "dark");
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  function cambiarTema() {
    const nuevo = temaActual() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nuevo;
    try {
      localStorage.setItem("sofia-tema", nuevo);
    } catch {
      /* el navegador no permite guardar: el tema dura solo esta visita */
    }
    setOscuro(nuevo === "dark");
  }

  return (
    <nav className="nav" aria-label="Principal">
      <div className="wrap">
        <a className="brand" href="#inicio">
          <RobotLogo size={30} />
          <span>
            sof<span style={{ color: "var(--accent)" }}>IA</span>
          </span>{" "}
          <small>por Gealytics</small>
        </a>
        <ul>
          {ENLACES.map((e) => (
            <li key={e.href}>
              <a href={e.href}>{e.texto}</a>
            </li>
          ))}
        </ul>
        <button
          className={`theme-btn${oscuro ? " is-dark" : ""}`}
          type="button"
          onClick={cambiarTema}
          aria-label={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path className="moon" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            <g className="sun">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </g>
          </svg>
        </button>
        <a className="btn" href="#interfaz">
          Probar la demo
        </a>
      </div>
    </nav>
  );
}
