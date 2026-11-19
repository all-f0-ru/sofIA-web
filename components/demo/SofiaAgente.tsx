'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

type SofiaWindow = Window & { sofiaAgente?: { montar: (el: HTMLElement) => void } };

/** Monta el agente sofIA dentro de la página. Úsalo en la sección Demo: <SofiaAgente /> */
export default function SofiaAgente() {
  const ref = useRef<HTMLDivElement>(null);

  const montar = () => {
    const el = ref.current;
    const w = window as SofiaWindow;
    if (el && w.sofiaAgente && !el.dataset.listo) {
      el.dataset.listo = '1';
      w.sofiaAgente.montar(el);
    }
  };

  useEffect(() => { montar(); }, []);

  return (
    <>
      <div ref={ref} id="sofia-agente" suppressHydrationWarning />
      <Script src="/sofia-agente.js" strategy="afterInteractive" onLoad={montar} onReady={montar} />
    </>
  );
}
