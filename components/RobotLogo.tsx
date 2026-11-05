/** Símbolo de sofIA: carita de robot guiñando un ojo. Toma los colores del tema. */
export default function RobotLogo({ size = 28, title }: { size?: number; title?: string }) {
  return (
    <svg className="robot" width={size} height={size} viewBox="0 0 28 28" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d="M14 6V3" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" />
      <circle className="robot-antena" cx="14" cy="2.6" r="1.7" fill="var(--accent)" />
      <rect x="0.8" y="12" width="2.4" height="6" rx="1.2" fill="var(--ink)" />
      <rect x="24.8" y="12" width="2.4" height="6" rx="1.2" fill="var(--ink)" />
      <rect x="3" y="6" width="22" height="19" rx="6" fill="var(--ink)" />
      <circle className="robot-ojo" cx="9.8" cy="13.6" r="2.2" fill="var(--bg)" />
      <path d="M15.8 14.2q2.2-2.4 4.4 0" stroke="var(--bg)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path className="robot-sonrisa" d="M9.6 19.2q4.4 3.2 8.8 0" stroke="var(--accent-on-ink)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}
