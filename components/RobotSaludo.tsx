/** Robot de sofIA de cuerpo completo que saluda, animado (propuesta B). Respeta prefers-reduced-motion en el CSS. */
export default function RobotSaludo() {
  return (
    <svg className="rs" viewBox="6 0 50 40" width="260" height="208" role="img" aria-label="sofIA te saluda">
      <g className="rs-cuerpo">
        <g transform="translate(18,2)">
          <path className="rs-antena" d="M14 6V3" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" />
          <circle className="rs-antena" cx="14" cy="2.6" r="1.7" fill="var(--accent)" />
          <rect x="0.8" y="12" width="2.4" height="6" rx="1.2" fill="var(--ink)" />
          <rect x="24.8" y="12" width="2.4" height="6" rx="1.2" fill="var(--ink)" />
          <rect x="3" y="6" width="22" height="19" rx="6" fill="var(--ink)" />
          <circle cx="9.8" cy="13.6" r="2.2" fill="var(--bg)" />
          <path d="M15.8 14.2q2.2-2.4 4.4 0" stroke="var(--bg)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M9.6 19.2q4.4 3.2 8.8 0" stroke="var(--accent-on-ink)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
        <g transform="translate(2,0)">
          <rect x="17" y="28" width="26" height="22" rx="10" fill="var(--ink)" />
          <rect x="23" y="33" width="14" height="9" rx="2.5" fill="var(--accent)" />
          <rect className="rs-barra" x="25" y="36.5" width="2" height="4.5" rx="1" fill="var(--bg)" />
          <rect className="rs-barra" x="28.5" y="34.5" width="2" height="6.5" rx="1" fill="var(--bg)" />
          <rect className="rs-barra" x="32" y="35.5" width="2" height="5.5" rx="1" fill="var(--bg)" />
          <rect x="11.5" y="34" width="5.5" height="13" rx="2.75" fill="var(--ink)" />
          <rect className="rs-brazo" x="40.5" y="34" width="5.5" height="13" rx="2.75" fill="var(--ink)" />
          <rect x="23" y="50" width="6" height="11" rx="3" fill="var(--ink)" />
          <rect x="31" y="50" width="6" height="11" rx="3" fill="var(--ink)" />
          <rect x="20" y="59" width="11" height="5" rx="2.5" fill="var(--ink)" />
          <rect x="31" y="59" width="11" height="5" rx="2.5" fill="var(--ink)" />
        </g>
      </g>
    </svg>
  );
}
