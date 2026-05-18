const fs = require('fs');
const path = require('path');

const TOTAL_NUMEROS = 99;

// Generar los 99 botones para el HTML interactivo
let gridButtonsHtml = '';
for (let i = 1; i <= TOTAL_NUMEROS; i++) {
  gridButtonsHtml += `        <button class="ficha-num" data-numero="${i}" aria-label="Número ${i}, no ha salido" aria-pressed="false">${i}</button>\n`;
}

// Generar los 99 elementos para la versión noscript (fallback estático para SEO)
let noscriptListHtml = '';
for (let i = 1; i <= TOTAL_NUMEROS; i++) {
  noscriptListHtml += `          <div class="ficha-num" style="background-color: #cbd5e1; color: #334155; display: inline-flex; width: 60px; height: 60px; margin: 5px; align-items: center; justify-content: center; border-radius: 12px; font-weight: bold;">${i}</div>\n`;
}

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tablero de Lotería 1-99: Marca los números que han salido – Juego de mesa</title>
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="Tablero interactivo para la lotería de números del 1 al 99. Toca cada ficha para registrar las bolas que han salido. Sin registro y con guardado automático.">
  <meta name="keywords" content="lotería, tablero de lotería, bingo 99, marcar números, bolillero, juego de mesa, lotería online">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://julianste15.github.io/loteria/">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://julianste15.github.io/loteria/">
  <meta property="og:title" content="Tablero de Lotería 1-99: Marca los números que han salido">
  <meta property="og:description" content="Registra de manera interactiva las bolas que han salido en tu juego de lotería o bingo del 1 al 99.">
  <meta property="og:image" content="https://julianste15.github.io/loteria/assets/og-image.png">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://julianste15.github.io/loteria/">
  <meta property="twitter:title" content="Tablero de Lotería 1-99: Marca los números que han salido">
  <meta property="twitter:description" content="Registra de manera interactiva las bolas que han salido en tu juego de lotería o bingo del 1 al 99.">
  <meta property="twitter:image" content="https://julianste15.github.io/loteria/assets/og-image.png">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="assets/icono.svg">
  
  <!-- CSS Principal -->
  <link rel="stylesheet" href="css/estilo.css">

  <!-- Datos estructurados (JSON-LD) para SEO -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Tablero de Lotería 1-99",
    "description": "Registra visualmente los números que van saliendo en una lotería de mesa del 1 al 99.",
    "applicationCategory": "GameApplication",
    "genre": "Juegos de Mesa / Herramientas",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "operatingSystem": "All",
    "browserRequirements": "JavaScript habilitado para interactividad"
  }
  </script>
</head>
<body>

  <header>
    <h1>Tablero de Lotería 1 - 99</h1>
    <p class="subtitle">Herramienta interactiva y accesible para marcar las bolas que van saliendo en tu juego de mesa.</p>
  </header>

  <noscript>
    <div class="noscript-alert">
      <strong>¡Atención!</strong> Para poder marcar los números y guardar tu progreso automáticamente, necesitas habilitar JavaScript en tu navegador.
    </div>
    <div class="tablero-grid" style="display: flex; flex-wrap: wrap; justify-content: center;">
${noscriptListHtml}    </div>
  </noscript>

  <main>
    <section class="control-panel">
      <div class="stats" aria-live="polite">
        <div class="stat-box">
          <span>Salidos:</span>
          <span id="val-salidos" class="stat-value salidos">0</span>
        </div>
        <div class="stat-box">
          <span>Restantes:</span>
          <span id="val-restantes" class="stat-value">99</span>
        </div>
      </div>
      
      <div class="btn-container">
        <button id="btn-todos" class="btn btn-primary" aria-label="Marcar todos los números (para pruebas)">
          Marcar Todos
        </button>
        <button id="btn-reiniciar" class="btn btn-danger" aria-label="Reiniciar tablero de lotería y borrar memoria">
          Reiniciar Tablero
        </button>
      </div>
    </section>

    <section class="tablero-container" aria-label="Cuadrícula del tablero de lotería">
      <div id="tablero-grid" class="tablero-grid" role="grid">
${gridButtonsHtml}      </div>
    </section>
  </main>

  <footer>
    <p>Tablero de Lotería 1-99 Julianste15 &copy; 2026. Diseñado para ofrecer máxima velocidad, accesibilidad y soporte SEO.</p>
    <p>Hecho con HTML5, CSS Grid y JavaScript Vanilla. Funciona 100% offline y almacena localmente tus datos en el dispositivo.</p>
  </footer>

  <!-- JS Principal -->
  <script src="js/tablero.js" defer></script>
</body>
</html>
`;

// Crear carpeta assets si no existe
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Escribir index.html
fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent, 'utf8');
console.log('¡index.html generado exitosamente con 99 botones estáticos!');
