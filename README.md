# sofIA · sitio web

Sitio de presentación de **sofIA**, la asistente de datos con IA de Gealytics para MiPymes.
Convierte preguntas escritas en español en respuestas claras, con los números que las respaldan.
Incluye una demo interactiva del caso de uso metalmecánico.

- **Tecnología:** Next.js 14 (App Router) + React 18 + TypeScript
- **Publicación:** Netlify (con `netlify.toml` incluido)
- **Demo:** simulada con datos de ejemplo, lista para conectarse a la IA real

---

## Requisitos

- Node.js 18.17 o superior (recomendado: 20)
- npm

## Correr en tu computador

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

Para probar la versión de producción:

```bash
npm run build
npm start
```

## Estructura

```
app/
  layout.tsx            Fuentes (Archivo, IBM Plex Sans, JetBrains Mono), metadatos y tema
  page.tsx              Página de inicio: arma todas las secciones
  globals.css           Identidad visual: tokens de color (claro y oscuro), tipografía y componentes
  api/preguntar/route.ts  API de la demo: POST { pregunta } → respuesta de sofIA
  feria/page.tsx        Modo feria: pantalla completa para el stand, con QR (/feria)
  interacciones.css     Animaciones y efectos al pasar el cursor
  sofia.css             Consola semántica, recorrido, comparador, confianza y modo feria
components/
  Nav.tsx               Menú fijo y botón de modo claro/oscuro
  HeroInteractivo.tsx   Portada: consola donde el modelo semántico analiza la pregunta en vivo
  ComoPiensa.tsx        Recorrido de una pregunta: persona → modelo semántico → motor lógico → IA
  Comparador.tsx        Deslizador "Sin sofIA / Con sofIA"
  Semantica.tsx         Pregunta resaltada, chips de interpretación y texto con negritas
  ModoFeria.tsx         Pantalla del stand con preguntas que rotan solas
  CodigoQR.tsx          QR hacia https://sofia-gealytics.netlify.app
  Efectos.tsx           Aparición al hacer scroll, luz en la portada e inclinación de tarjetas
  Secciones.tsx         Problema, Confianza, Rubros, Indicadores, Metodología, Equipo, Footer
  Cota.tsx              Cota estimado vs. real (elemento propio de la marca)
  RobotLogo.tsx         Símbolo de sofIA
  demo/DemoApp.tsx      Demo interactiva: lista de OT, chat e inspector de 4 pasos
lib/sofia/
  tipos.ts              Tipos compartidos
  datos.ts              Órdenes de trabajo de ejemplo (semana 42)
  semantico.ts          Modelo semántico: pregunta → intención, entidad, métrica y SQL
  motor.ts              Motor lógico: desviaciones, umbrales y KPIs (cálculos auditables)
  responder.ts          Orquesta los 4 pasos con el redactor simulado
  proveedores.ts        Elige el modo de respuesta: "simulado" o "ia"
public/
  icon.svg              Favicon (robot de sofIA)
```

### Cómo responde sofIA

Cada respuesta pasa por 4 pasos, y el inspector de la demo los muestra:

1. **Modelo semántico** (`semantico.ts`): entiende la pregunta y la traduce a intención, entidad y métrica.
2. **Consulta** (`semantico.ts`): genera el SQL equivalente sobre `ordenes_trabajo`.
3. **Motor lógico** (`motor.ts`): calcula desviaciones y KPIs con fórmulas fijas.
4. **Redacción** (`responder.ts`): escribe la respuesta usando solo las cifras del paso 3.

La IA nunca calcula: solo explica lo que el motor ya calculó.

## Subir a GitHub

1. Crea un repositorio vacío en GitHub, por ejemplo `sofia-web` (sin README ni .gitignore).
2. En la carpeta del proyecto:

```bash
git remote add origin https://github.com/TU_USUARIO/sofia-web.git
git branch -M main
git push -u origin main
```

El proyecto ya viene con un primer commit hecho.

## Publicar en Netlify

1. Entra a https://app.netlify.com y elige **Add new site → Import an existing project**.
2. Conecta GitHub y elige el repositorio `sofia-web`.
3. Netlify lee `netlify.toml` y detecta Next.js solo. Deja los valores que propone:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Presiona **Deploy**. En unos minutos tendrás una dirección como `sofia-web.netlify.app`.
5. Opcional: en **Site configuration → Change site name** puedes dejarla como `sofia-gealytics.netlify.app`.

Cada vez que hagan `git push` a `main`, Netlify vuelve a publicar el sitio.

## Variables de entorno

| Variable | Valor | Uso |
| --- | --- | --- |
| `SOFIA_MODO` | `simulado` (por defecto) o `ia` | Elige cómo responde la demo |

Copia `.env.example` a `.env.local` para cambiarlas en tu computador. En Netlify se cambian en
**Site configuration → Environment variables**.

## Conectar la IA real (siguiente etapa)

Todo el cambio ocurre en `lib/sofia/proveedores.ts`, en la función `responderConIA`. El resto del sitio no cambia,
porque la demo ya llama a `/api/preguntar` y espera una `RespuestaSofia`.

1. **Base de datos:** reemplazar `datos.ts` por una consulta a la base real (por ejemplo PostgreSQL en Supabase o Neon).
2. **Modelo semántico:** cargar el diccionario de cada empresa (entidades, sinónimos y métricas) y usar un modelo de
   lenguaje solo cuando la pregunta sea ambigua.
3. **Motor lógico:** reutilizar `motor.ts` tal como está.
4. **Redactor:** enviar al modelo de lenguaje las filas del paso 3 y pedirle que explique sin inventar cifras.
5. Guardar la API key como variable de entorno en Netlify (nunca en el código) y cambiar `SOFIA_MODO` a `ia`.

## Créditos

Gealytics · Formando y Construyendo Conocimientos Ltda. · Antofagasta, Chile · 2026
