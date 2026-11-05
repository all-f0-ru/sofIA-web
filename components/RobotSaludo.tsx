/**
 * Robot de sofIA asomándose desde un bloque: una mano se agarra del borde y la otra saluda.
 * Animado; respeta prefers-reduced-motion en el CSS.
 */
export default function RobotSaludo() {
  return (
    <svg className="rs" viewBox="0 0 60 32" width="260" height="139" role="img" aria-label="sofIA te saluda desde detrás de un bloque">
      <g className="rs-cabeza">
        <g transform="translate(18,0)">
          <path className="rs-antena" d="M14 6V3" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" />
          <circle className="rs-antena" cx="14" cy="2.6" r="1.7" fill="var(--accent)" />
          <rect x="0.8" y="12" width="2.4" height="6" rx="1.2" fill="var(--ink)" />
          <rect x="24.8" y="12" width="2.4" height="6" rx="1.2" fill="var(--ink)" />
          <rect x="3" y="6" width="22" height="19" rx="6" fill="var(--ink)" />
          <circle cx="9.8" cy="13.6" r="2.2" fill="var(--bg)" />
          <path d="M15.8 14.2q2.2-2.4 4.4 0" stroke="var(--bg)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M9.6 19.2q4.4 3.2 8.8 0" stroke="var(--accent-on-ink)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      </g>
      {/* Bloque donde se agarra */}
      <rect x="2" y="25" width="56" height="4" rx="2" fill="var(--ink)" />
      {/* Mano izquierda agarrada del borde */}
      <rect className="rs-agarre" x="9" y="18" width="11" height="9" rx="4.5" fill="var(--ink)" />
      <rect x="9" y="18" width="11" height="3" rx="1.5" fill="var(--bg)" opacity="0.25" />
      {/* Brazo derecho saludando */}
      <g className="rs-brazo">
        <path d="M44 27 L47 13" stroke="var(--ink)" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="47.5" cy="10.5" r="3.4" fill="var(--ink)" />
      </g>
    </svg>
  );
}
