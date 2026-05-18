## Plan para Tablero de Lotería (números 1 al 99) – Web sin login y con SEO optimizado

### 1. Resumen funcional
- Mostrar una cuadrícula con los números del **1 al 99**.
- Cada número se representa como una **ficha** o botón táctil.
- **Estado inicial**: todas las fichas en **gris** (no han salido).
- Al hacer clic/tocar una ficha, cambia a **verde** (número ya salido).
- El estado se guarda automáticamente en el navegador (**localStorage**) para que no se pierda al recargar o cerrar la página.
- No requiere registro ni inicio de sesión.
- **Responsive**: se adapta a móviles, tablets y escritorio.
- **SEO optimizado**: la página es rastreable, rápida y contiene metadatos, datos estructurados y contenido semántico.

### 2. Especificaciones técnicas (stack recomendado)

| Capa          | Tecnología                               |
|---------------|------------------------------------------|
| Frontend      | HTML5, CSS3 (Flexbox/Grid), JavaScript vanilla (ES6+) |
| Persistencia  | `localStorage` del navegador             |
| Alojamiento   | GitHub Pages, Netlify o Vercel (estático) |
| Control de versiones | Git                                |

**Por qué vanilla JS**: sin dependencias, carga mínima, máxima compatibilidad y facilidad de SEO (HTML generado en el servidor o híbrido).

### 3. Arquitectura de la página (SEO friendly)

Para que los motores de búsqueda vean todos los números incluso si el JS falla, utilizaremos **renderizado híbrido**:

- El HTML inicial contiene la cuadrícula completa (99 elementos) generada con **PHP** en el servidor o con **JavaScript** inyectado al cargar. Como recomendamos una web estática pura, usaremos **JS para construir la cuadrícula al inicio** pero con una estrategia de **contenido progresivo**:
  - En el HTML base incluimos un `noscript` con la cuadrícula estática (por si el usuario navega sin JS).  
  - Para los crawlers modernos que ejecutan JS (Googlebot, Bing), no hay problema, pero añadimos **meta tags** y **datos estructurados** en el HTML raíz.

**Alternativa más robusta para SEO extremo**: Generar el HTML de la cuadrícula con un build script (por ejemplo, usando Node.js o un generador estático como **Eleventy**, **Astro** o **Hugo**). Así el servidor entrega el HTML completo con los 99 números. Luego el JS añade interactividad y localStorage.

*Elegiremos la opción con generador estático (recomiendo Astro o simple script en Node) porque:*
- Los 99 números aparecen en el código fuente inicial.
- Se pueden poner atributos `data-numero` y clases iniciales.
- El JS solo añade eventos y restaura el estado desde localStorage.

### 4. Diseño de la interfaz

- **Header**: título "Tablero de Lotería - Números del 1 al 99", breve instrucción ("Toca un número para marcarlo como salido").
- **Cuadrícula**: 10 columnas en desktop, se ajusta automáticamente en móvil (grid con `grid-template-columns: repeat(auto-fill, minmax(70px, 1fr))`).
- Cada **ficha**:
  - Tamaño mínimo 60x60px, centrado, bordes redondeados, sombra ligera.
  - Color gris claro (`#ccc`), texto negro.
  - Cuando está marcada (verde): `#2e7d32` con texto blanco.
  - Transición suave al tocar.
  - Atributo `aria-label="Número 15, no salido"` que se actualiza al marcar.
- **Botones adicionales**:
  - "Reiniciar tablero" (pone todos en gris y limpia localStorage).
  - "Seleccionar todos" (opcional, pero útil para pruebas).
- **Pie de página** con información de accesibilidad y última actualización.

### 5. Comportamiento y lógica

1. Al cargar la página:
   - Construir la cuadrícula (si no viene estática) o enlazar eventos a los elementos existentes.
   - Leer `localStorage.getItem('numerosMarcados')` (array de números marcados).
   - Aplicar la clase `marcado` (verde) a esos números.
2. Al hacer clic en un número:
   - Alternar su estado: si estaba gris → verde y guardar en localStorage; si estaba verde → gris y quitar del almacenamiento (permite desmarcar por error).
   - Actualizar el `aria-label`.
3. Al reiniciar:
   - Eliminar la clave de localStorage y resetear todas las clases a gris.
4. Al salir y volver, se mantiene el estado.

**Consideración**: Para evitar guardar después de cada clic con sobrecarga, se guarda el array completo de números marcados.

### 6. Estrategia de SEO (pasos concretos)

| Elemento                     | Acción                                                                 |
|------------------------------|------------------------------------------------------------------------|
| **Título** (`<title>`)       | "Tablero de Lotería 1-99: Marca los números que han salido – Juego de mesa" |
| **Meta descripción**         | "Tablero interactivo para la lotería de números del 1 al 99. Toca cada ficha para registrar las bolas que han salido. Sin registro, guardado automático." |
| **Encabezados**              | `<h1>` principal, `<h2>` para instrucciones, `<h2>` para la cuadrícula. |
| **URL amigable**             | `tablero-loteria-1-99` o `loteria-numeros`                            |
| **Datos estructurados (JSON-LD)** | Schema.org `BoardGame` o `Game`. Indicar que es una herramienta para juego de lotería con números. |
| **Indexabilidad**            | Archivo `robots.txt` permitiendo todo, `sitemap.xml` con la URL.       |
| **Rendimiento**              | Código mínimo, imágenes nulas o solo iconos SVG, `preconnect` a nada externo. Puntuación 100 en Lighthouse. |
| **Accesibilidad**            | Contraste suficiente (gris/verde), navegación por teclado (TAB, Enter), etiquetas ARIA. |
| **Idioma**                   | `lang="es"` en el HTML.                                                |
| **Open Graph**               | Meta tags para compartir en redes (imagen predefinida con vista previa del tablero). |
| **HTML semántico**           | Usar `<main>`, `<section>`, `<ul>` o `<div role="grid">` para la cuadrícula. |

**Ejemplo de JSON-LD**:
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Tablero de Lotería 1-99",
  "description": "Registra visualmente los números que van saliendo en una lotería de mesa del 1 al 99.",
  "applicationCategory": "Game",
  "offers": { "@type": "Offer", "price": "0" },
  "operatingSystem": "All",
  "browserRequirements": "JavaScript habilitado para interactividad"
}
```

### 7. Optimización de rendimiento (vital para SEO)

- **CSS crítico** inline o en `<style>` para mostrar la cuadrícula rápidamente.
- **JavaScript** al final del `<body>` o con `defer`.
- **Sin librerías externas** (ni jQuery, ni Bootstrap pesado).
- **Iconos** con CSS puro o Unicode (✔️ para números marcados) – sin fuentes externas.
- **Imágenes** ninguna; si se añade un logo, usar SVG comprimido.
- **Lazy loading** no aplica, pero se puede usar `loading="eager"`.
- **Prerender** de los enlaces (no hay enlaces internos, pero se puede precargar el script).

### 8. Ejemplo de estructura de archivos

```
/
├── index.html
├── css/
│   └── estilo.css
├── js/
│   └── tablero.js
├── assets/
│   └── icono.svg (favicon)
├── sitemap.xml
├── robots.txt
└── .nojekyll (para GitHub Pages)
```

### 9. Pasos de implementación (plan de acción)

1. **Crear maqueta HTML** con el esqueleto (header, main, footer).
2. **Generar la cuadrícula estática**:
   - Si usas generador estático: script que escribe 99 `<button>` o `<div role="button">`.
   - Si no, JavaScript puro: `document.getElementById('grid').innerHTML = ...` pero con `defer` y `noscript`.
   - Recomiendo **generador estático sencillo** con Node.js (un script que produce `index.html` final).
3. **Aplicar CSS** con Grid, colores, hover, active, transiciones.
4. **Escribir JavaScript**:
   - Variables: `numerosMarcados = []`.
   - Funciones: `guardarEstado()`, `pintarDesdeAlmacenamiento()`, `alternarNumero(numero)`.
   - Eventos: delegación en la cuadrícula.
5. **Añadir botón de reinicio** y opcional "Reset all".
6. **Insertar metadatos y JSON-LD** en `<head>`.
7. **Pruebas**:
   - Lighthouse (SEO, accesibilidad, rendimiento).
   - Verificar funcionamiento en móvil (táctil).
   - Simular deshabilitación de JS (debe mostrar el `noscript` con los números en gris, sin interactividad).
8. **Desplegar** en GitHub Pages o Netlify.

### 10. Mejoras opcionales (post-MVP)

- **Animación** al marcar (breve efecto de escala).
- **Contador** de cuántos números han salido / faltan.
- **Modo oscuro** (respetando `prefers-color-scheme`).
- **Exportar/importar** el estado (archivo JSON) para compartir entre dispositivos.
- **Atajos de teclado** (números del 1 al 99).
- **Sonido opcional** al marcar (con permiso del usuario).

### 11. Comprobación final de SEO

| Requisito                           | Cómo se cumple                                    |
|-------------------------------------|---------------------------------------------------|
| URLs limpias                        | Una sola URL, sin parámetros.                   |
| Tiempo de carga < 1.5s             | Sin librerías, CSS mínimo, script pequeño.       |
| Contenido visible antes de JS       | El HTML estático (si usas generador) muestra los números. |
| Enlaces internos                    | No aplica, pero el sitio es autocontenido.       |
| Mobile friendly                     | Grid responsiva, botones grandes.                |
| HTTPS                               | Disponible gratis en GitHub Pages/Netlify.       |
| Meta robots                         | `index, follow` por defecto.                     |

### 12. Conclusión

Con este plan obtendrás una página web funcional, táctil, que guarda el estado localmente, sin necesidad de servidor, y con **excelente SEO** porque:
- El HTML inicial contendrá todos los números (si usas generación estática).
- Los metadatos y datos estructurados son correctos.
- El rendimiento es máximo al no usar frameworks pesados.

**Próximo paso**: ¿Quieres que desarrolle el código completo de `index.html`, `style.css` y `tablero.js` según estas especificaciones? Puedo generarlo para que solo tengas que copiarlo y subirlo a tu hosting.