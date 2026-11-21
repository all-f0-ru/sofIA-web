
/* sofia-agente.js - widget del agente sofIA.
   Expone window.sofiaAgente.montar(elemento) para montarlo desde React/Next.js.
   En HTML simple: <div id="sofia-agente"></div> y <script src="sofia-agente.js" data-auto defer></script>
   (sin el atributo data-auto el script no hace nada hasta que se llame a montar). */
(() => {
  'use strict';
  const SCRIPT = document.currentScript;
  const API = '/api/sofia';
  const TIMEOUT_MS = 45000;
  const SUGERENCIAS = [

  ];

  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* sin almacenamiento */ } },
    del(k) { try { sessionStorage.removeItem(k); } catch { /* sin almacenamiento */ } },
  };
  const nuevoId = () =>
    (window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2))
      .replace(/[^\w-]/g, '').slice(0, 64);

  // <md>
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s) =>
    esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*(?!\s)([^*]+?)\*(?!\*)/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  const celdas = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  const esFilaTabla = (l) => /^\s*\|.*\|\s*$/.test(l);
  const esSeparador = (l) => /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(l) && /-/.test(l);
  const esLista = (l) => /^\s*[-*]\s+/.test(l);
  const esNumerada = (l) => /^\s*\d+[.)]\s+/.test(l);
  const esTitulo = (l) => /^\s*#{1,4}\s+/.test(l);
  function md(src) {
    const L = String(src).replace(/\r/g, '').replace(/\\n/g, '\n').split('\n');
    const out = [];
    let i = 0;
    while (i < L.length) {
      const ln = L[i];
      if (esFilaTabla(ln) && i + 1 < L.length && esSeparador(L[i + 1])) {
        const cab = celdas(ln); i += 2;
        const filas = [];
        while (i < L.length && esFilaTabla(L[i])) { filas.push(celdas(L[i])); i++; }
        out.push('<div class="sofia-ag-tw"><table><thead><tr>' + cab.map((c) => '<th>' + inline(c) + '</th>').join('') +
          '</tr></thead><tbody>' + filas.map((r) => '<tr>' + r.map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') +
          '</tbody></table></div>');
        continue;
      }
      if (esLista(ln)) {
        const it = [];
        while (i < L.length && esLista(L[i])) { it.push(L[i].replace(/^\s*[-*]\s+/, '')); i++; }
        out.push('<ul>' + it.map((t) => '<li>' + inline(t) + '</li>').join('') + '</ul>');
        continue;
      }
      if (esNumerada(ln)) {
        const it = [];
        while (i < L.length && esNumerada(L[i])) { it.push(L[i].replace(/^\s*\d+[.)]\s+/, '')); i++; }
        out.push('<ol>' + it.map((t) => '<li>' + inline(t) + '</li>').join('') + '</ol>');
        continue;
      }
      if (esTitulo(ln)) { out.push('<p><strong>' + inline(ln.replace(/^\s*#{1,4}\s+/, '')) + '</strong></p>'); i++; continue; }
      if (!ln.trim()) { i++; continue; }
      const p = [];
      while (i < L.length && L[i].trim() && !esLista(L[i]) && !esNumerada(L[i]) && !esTitulo(L[i]) && !(esFilaTabla(L[i]) && i + 1 < L.length && esSeparador(L[i + 1]))) {
        p.push(inline(L[i])); i++;
      }
      if (!p.length) { p.push(inline(L[i])); i++; }
      out.push('<p>' + p.join('<br>') + '</p>');
    }
    return out.join('');
  }
  // </md>
  window.__sofiaMd = md;

  const CSS = `
.sofia-ag{--bg:#0f151c;--panel:#151d27;--borde:#26323f;--txt:#e6edf3;--suave:#9fb0c0;--ac:#14b8b0;--act:#14b8b0;--ac-txt:#04201f;--err:#ff8f8f;--hd:#0b1016;
 font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--txt);background:var(--bg);border:1px solid var(--borde);border-radius:16px;
 display:flex;flex-direction:column;overflow:hidden;width:100%;max-width:900px;height:min(72vh,620px);min-height:420px;margin:0 auto;box-sizing:border-box;position:relative}
.sofia-ag *{box-sizing:border-box}
.sofia-ag-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;background:var(--panel);border-bottom:1px solid var(--borde)}
.sofia-ag-title{display:flex;align-items:center;gap:8px;min-width:0}
.sofia-ag-dot{width:9px;height:9px;border-radius:50%;background:var(--ac);flex:none}
.sofia-ag-sub{color:var(--suave);font-size:.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sofia-ag-btn{background:transparent;color:var(--suave);border:1px solid var(--borde);border-radius:999px;padding:6px 12px;font:inherit;font-size:.82rem;cursor:pointer}
.sofia-ag-btn:hover{color:var(--txt);border-color:var(--suave)}
.sofia-ag-body{flex:1;min-height:0;display:flex;flex-direction:column}
.sofia-ag-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
.sofia-ag-m{max-width:88%;padding:10px 14px;border-radius:14px;overflow-wrap:anywhere}
.sofia-ag-m p{margin:0 0 .6em}.sofia-ag-m p:last-child{margin-bottom:0}
.sofia-ag-m ul,.sofia-ag-m ol{margin:.2em 0 .6em;padding-left:1.3em}
.sofia-ag-m code{background:var(--hd);border:1px solid var(--borde);border-radius:4px;padding:0 4px;font-size:.9em}
.sofia-ag-bot{align-self:flex-start;background:var(--panel);border:1px solid var(--borde)}
.sofia-ag-user{align-self:flex-end;background:var(--ac);color:var(--ac-txt)}
.sofia-ag-err{border-color:var(--err);color:var(--err)}
.sofia-ag-tw{overflow-x:auto;margin:.3em 0 .6em;max-width:100%}
.sofia-ag-tw table{border-collapse:collapse;font-size:.9rem;min-width:100%}
.sofia-ag-tw th,.sofia-ag-tw td{border:1px solid var(--borde);padding:6px 10px;text-align:left;white-space:nowrap}
.sofia-ag-tw th{background:var(--hd)}
.sofia-ag-chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 12px}
.sofia-ag-chips[hidden]{display:none}
.sofia-ag-chip{background:transparent;color:var(--txt);border:1px solid var(--borde);border-radius:999px;padding:6px 12px;font:inherit;font-size:.85rem;cursor:pointer;text-align:left}
.sofia-ag-chip:hover{border-color:var(--ac);color:var(--act)}
.sofia-ag-form{display:flex;gap:8px;padding:12px;border-top:1px solid var(--borde);background:var(--panel)}
.sofia-ag-in{flex:1;min-width:0;resize:none;max-height:120px;background:var(--bg);color:var(--txt);border:1px solid var(--borde);border-radius:12px;padding:10px 12px;font:inherit;font-size:16px;line-height:1.4}
.sofia-ag-in:focus,.sofia-ag-btn:focus-visible,.sofia-ag-chip:focus-visible,.sofia-ag-send:focus-visible,.sofia-ag-code:focus{outline:2px solid var(--ac);outline-offset:1px}
.sofia-ag-send{background:var(--ac);color:var(--ac-txt);border:0;border-radius:12px;padding:0 18px;font:inherit;font-weight:600;cursor:pointer}
.sofia-ag-send:disabled{opacity:.5;cursor:not-allowed}
.sofia-ag-foot{margin:0;padding:6px 14px 10px;color:var(--suave);font-size:.75rem;background:var(--panel)}
.sofia-ag-gate{position:absolute;inset:0;z-index:2;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center}
.sofia-ag-gate[hidden]{display:none}
.sofia-ag-code{width:min(320px,100%);background:var(--panel);color:var(--txt);border:1px solid var(--borde);border-radius:12px;padding:10px 12px;font-size:16px}
.sofia-ag-gerr{color:var(--err);min-height:1.4em;margin:0;font-size:.9rem}
.sofia-ag-typing{display:inline-flex;gap:4px;align-items:center}
.sofia-ag-typing i{width:6px;height:6px;border-radius:50%;background:var(--suave);animation:sofia-p 1.2s infinite ease-in-out}
.sofia-ag-typing i:nth-child(2){animation-delay:.15s}.sofia-ag-typing i:nth-child(3){animation-delay:.3s}
html[data-theme="light"] .sofia-ag{--bg:#ffffff;--panel:#f3f6f9;--borde:#d3dce5;--txt:#14202b;--suave:#566879;--act:#0b7f7a;--err:#c62828;--hd:#e8eef3;}
@media (prefers-color-scheme:light){html:not([data-theme="dark"]) .sofia-ag{--bg:#ffffff;--panel:#f3f6f9;--borde:#d3dce5;--txt:#14202b;--suave:#566879;--act:#0b7f7a;--err:#c62828;--hd:#e8eef3;}}
@keyframes sofia-p{0%,80%,100%{opacity:.25}40%{opacity:1}}
@media (prefers-reduced-motion:reduce){.sofia-ag-typing i{animation:none}.sofia-ag-msgs{scroll-behavior:auto}}
.sofia-ag-fab{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:9999;background:#14b8b0;color:#04201f;border:0;border-radius:999px;padding:12px 18px;font:600 15px system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.35)}
.sofia-ag-float{position:fixed;right:16px;bottom:calc(72px + env(safe-area-inset-bottom,0px));z-index:9999;width:min(420px,calc(100vw - 32px))}
.sofia-ag-float[hidden]{display:none}
@media (max-width:600px){.sofia-ag-m{max-width:95%}.sofia-ag-sub{display:none}}`;

  function montar(host) {
    let sid = store.get('sofia_sid') || nuevoId(); store.set('sofia_sid', sid);
    let codigo = store.get('sofia_cod') || '';
    let esAdmin = store.get('sofia_admin') === '1';
    let ocupado = false;

    host.innerHTML = `
<section class="sofia-ag" role="region" aria-label="Agente sofIA">
  <header class="sofia-ag-head">
    <div class="sofia-ag-title"><span class="sofia-ag-dot" aria-hidden="true"></span><strong>sofIA</strong><span class="sofia-ag-sub">Agente de órdenes de trabajo</span></div>
    <button type="button" class="sofia-ag-btn" data-a="reset">Nueva conversación</button>
  </header>
  <div class="sofia-ag-gate" hidden>
    <strong>Acceso al agente</strong>
    <p style="margin:0;color:var(--suave);font-size:.9rem">Ingresa tu código de acceso para consultar los datos.</p>
    <input class="sofia-ag-code" type="password" autocomplete="off" aria-label="Código de acceso" placeholder="Código de acceso">
    <p class="sofia-ag-gerr" role="alert"></p>
    <button type="button" class="sofia-ag-send" style="padding:10px 22px" data-a="entrar">Ingresar</button>
  </div>
  <div class="sofia-ag-body">
    <div class="sofia-ag-msgs" role="log" aria-live="polite"></div>
    <div class="sofia-ag-chips"></div>
  </div>
  <form class="sofia-ag-form">
    <input type="file" id="sofia-file-input" accept=".xlsx,.csv" hidden />
    <button type="button" id="sofia-btn-upload" title="Cargar OT desde Excel o CSV (solo administradores)" style="display:none; background:none; border:none; font-size:18px; cursor:pointer; padding:0 8px;">📎</button>
    <textarea class="sofia-ag-in" rows="1" maxlength="1000" aria-label="Escribe tu pregunta" placeholder="Escribe tu pregunta"></textarea>
    <button class="sofia-ag-send" type="submit">Preguntar</button>
  </form>
  <p class="sofia-ag-foot">Las cifras provienen de los registros. Las causas son hipótesis que debe validar tu equipo.</p>
</section>`;

    const $ = (s) => host.querySelector(s);
    const msgs = $('.sofia-ag-msgs'), chips = $('.sofia-ag-chips'), input = $('.sofia-ag-in'),
      send = $('.sofia-ag-send[type=submit]'), gate = $('.sofia-ag-gate'), gcode = $('.sofia-ag-code'), gerr = $('.sofia-ag-gerr');

    const bajar = () => { msgs.scrollTop = msgs.scrollHeight; };
    function burbuja(tipo, html, extra) {
      const d = document.createElement('div');
      d.className = 'sofia-ag-m sofia-ag-' + tipo + (extra ? ' ' + extra : '');
      d.innerHTML = html; msgs.appendChild(d); bajar(); return d;
    }
    function bienvenida() { burbuja('bot', '<p>Hola, soy sofIA. ¿En qué te puedo ayudar hoy?</p>'); }
    function sugerencias() {
      chips.innerHTML = '';
      SUGERENCIAS.forEach((t) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'sofia-ag-chip'; b.textContent = t;
        b.addEventListener('click', () => preguntar(t));
        chips.appendChild(b);
      });
    }
    function pedirCodigo(msg) { gerr.textContent = msg || ''; gate.hidden = false; gcode.value = ''; gcode.focus(); }

    //async function validarCodigo(c) {
      //try {
        //const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ping: true, codigo: c }) });
        //return r.ok;
      //} catch { return null; }
    //}
    
    async function validarCodigo(c) {
  try {
    const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ping: true, codigo: c }) });
    if (!r.ok) return false;
    const data = await r.json();
    esAdmin = Boolean(data.esAdmin);
    store.set('sofia_admin', esAdmin ? '1' : '0');
    const btnUp = $('#sofia-btn-upload');
    if (btnUp) btnUp.style.display = esAdmin ? 'inline-block' : 'none';
    return true;
  } catch { return null; }
}

    async function entrar() {
      const c = gcode.value.trim();
      if (!c) { gerr.textContent = 'Ingresa tu código.'; return; }
      gerr.textContent = 'Verificando…';
      const ok = await validarCodigo(c);
      if (ok === null) { gerr.textContent = 'No se pudo conectar. Revisa tu conexión.'; return; }
      if (!ok) { gerr.textContent = 'Código de acceso inválido.'; return; }
      codigo = c; store.set('sofia_cod', c); gate.hidden = true; gerr.textContent = ''; input.focus();
    }

    async function preguntar(texto) {
      texto = String(texto || '').trim();
      if (!texto || ocupado) return;
      if (!codigo) { pedirCodigo(); return; }
      ocupado = true; send.disabled = true; chips.hidden = true;
      burbuja('user', '<p>' + esc(texto) + '</p>');
      const t = burbuja('bot', '<span class="sofia-ag-typing" aria-label="sofIA está analizando"><i></i><i></i><i></i></span>');
      const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      try {
        const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: texto, sessionId: sid, codigo }), signal: ctrl.signal });
        let data = null; try { data = await r.json(); } catch { /* respuesta no JSON */ }
        if (r.status === 401) { t.remove(); store.del('sofia_cod'); codigo = ''; pedirCodigo('Tu código ya no es válido. Ingrésalo nuevamente.'); }
        else if (!r.ok || !data || typeof data.respuesta !== 'string') {
          t.className = 'sofia-ag-m sofia-ag-bot sofia-ag-err';
          t.innerHTML = '<p>' + (data && data.error === 'timeout' ? 'La consulta tardó demasiado. Intenta nuevamente.' : 'No pude procesar tu consulta en este momento. Intenta nuevamente.') + '</p>';
        } else { t.innerHTML = md(data.respuesta); }
      } catch (e) {
        t.className = 'sofia-ag-m sofia-ag-bot sofia-ag-err';
        t.innerHTML = '<p>' + (e && e.name === 'AbortError' ? 'La consulta tardó demasiado. Intenta nuevamente.' : 'Sin conexión con el servicio. Intenta nuevamente.') + '</p>';
      } finally {
        clearTimeout(to); ocupado = false; send.disabled = false; bajar(); input.focus();
      }
    }

    $('.sofia-ag-form').addEventListener('submit', (e) => { e.preventDefault(); const v = input.value; input.value = ''; input.style.height = 'auto'; preguntar(v); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('.sofia-ag-form').requestSubmit(); } });
    input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; });
    host.addEventListener('click', (e) => {
      const a = e.target && e.target.getAttribute && e.target.getAttribute('data-a');
      if (a === 'reset') { sid = nuevoId(); store.set('sofia_sid', sid); msgs.innerHTML = ''; chips.hidden = false; bienvenida(); }
      if (a === 'entrar') entrar();
    });
    gcode.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); entrar(); } });
    
    const btnUpload = $('#sofia-btn-upload');
    const fileInput = $('#sofia-file-input');
    if (esAdmin && btnUpload) btnUpload.style.display = 'inline-block';

    if (btnUpload && fileInput) {
      btnUpload.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        burbuja('user', '<p>📎 Subiendo archivo: <b>' + esc(file.name) + '</b></p>');
        const t = burbuja('bot', '<span class="sofia-ag-typing"><i></i><i></i><i></i></span>');

        const fd = new FormData();
        fd.append('file', file);
        fd.append('codigo', codigo);

        try {
          const r = await fetch('/api/cargar', { method: 'POST', body: fd });
          const data = await r.json();
          t.innerHTML = md(r.ok ? data.respuesta : (data.error || 'Error al cargar el archivo.'));
        } catch {
          t.innerHTML = '<p>Error de conexión al subir el archivo.</p>';
        }
        bajar();
        fileInput.value = '';
      });
    }

    bienvenida(); sugerencias();
    if (!codigo) pedirCodigo();
  }

  function estilos() {
    if (document.getElementById('sofia-ag-css')) return;
    const css = document.createElement('style'); css.id = 'sofia-ag-css'; css.textContent = CSS; document.head.appendChild(css);
  }
  function montarEn(host) { estilos(); host.innerHTML = ''; montar(host); }
  window.sofiaAgente = { montar: montarEn };

  function iniciarAuto() {
    const host = document.getElementById('sofia-agente');
    if (host) { montarEn(host); return; }
    // Modo flotante si no existe el contenedor
    estilos();
    const fab = document.createElement('button'); fab.className = 'sofia-ag-fab'; fab.type = 'button'; fab.textContent = 'Pregúntale a sofIA';
    const panel = document.createElement('div'); panel.className = 'sofia-ag-float'; panel.hidden = true;
    document.body.appendChild(panel); document.body.appendChild(fab);
    let listo = false;
    fab.addEventListener('click', () => { panel.hidden = !panel.hidden; if (!panel.hidden && !listo) { montar(panel); listo = true; } });
  }
  if (SCRIPT && SCRIPT.hasAttribute('data-auto')) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciarAuto); else iniciarAuto();
  }
})();
