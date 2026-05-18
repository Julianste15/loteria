document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('tablero-grid');
  const btnReiniciar = document.getElementById('btn-reiniciar');
  const btnSeleccionarTodos = document.getElementById('btn-todos');
  const valSalidos = document.getElementById('val-salidos');
  const valRestantes = document.getElementById('val-restantes');
  
  const TOTAL_NUMEROS = 99;
  let numerosMarcados = [];

  // 1. Cargar estado inicial desde localStorage
  try {
    const almacenado = localStorage.getItem('numerosMarcados');
    if (almacenado) {
      numerosMarcados = JSON.parse(almacenado);
      if (!Array.isArray(numerosMarcados)) {
        numerosMarcados = [];
      }
    }
  } catch (e) {
    console.error('Error leyendo localStorage:', e);
    numerosMarcados = [];
  }

  // 2. Pintar estado inicial en los botones
  const restaurarEstadoTablero = () => {
    const fichas = grid.querySelectorAll('.ficha-num');
    fichas.forEach(ficha => {
      const num = parseInt(ficha.getAttribute('data-numero'));
      if (numerosMarcados.includes(num)) {
        ficha.classList.add('marcado');
        ficha.setAttribute('aria-label', `Número ${num}, salido`);
        ficha.setAttribute('aria-pressed', 'true');
      } else {
        ficha.classList.remove('marcado');
        ficha.setAttribute('aria-label', `Número ${num}, no ha salido`);
        ficha.setAttribute('aria-pressed', 'false');
      }
    });
    actualizarEstadisticas();
  };

  // 3. Actualizar estadísticas en pantalla
  const actualizarEstadisticas = () => {
    const totalSalidos = numerosMarcados.length;
    const totalRestantes = TOTAL_NUMEROS - totalSalidos;
    
    valSalidos.textContent = totalSalidos;
    valRestantes.textContent = totalRestantes;
  };

  // 4. Delegación de eventos para la cuadrícula
  grid.addEventListener('click', (e) => {
    const ficha = e.target.closest('.ficha-num');
    if (!ficha) return;

    const num = parseInt(ficha.getAttribute('data-numero'));
    
    if (numerosMarcados.includes(num)) {
      // Si ya estaba marcado, quitarlo
      numerosMarcados = numerosMarcados.filter(n => n !== num);
      ficha.classList.remove('marcado');
      ficha.setAttribute('aria-label', `Número ${num}, no ha salido`);
      ficha.setAttribute('aria-pressed', 'false');
    } else {
      // Si no estaba marcado, añadirlo
      numerosMarcados.push(num);
      ficha.classList.add('marcado');
      ficha.setAttribute('aria-label', `Número ${num}, salido`);
      ficha.setAttribute('aria-pressed', 'true');
    }

    // Guardar estado
    localStorage.setItem('numerosMarcados', JSON.stringify(numerosMarcados));
    actualizarEstadisticas();
  });

  // 5. Botón Reiniciar
  btnReiniciar.addEventListener('click', () => {
    if (numerosMarcados.length === 0) return;
    
    const confirmar = confirm('¿Estás seguro de que deseas reiniciar todo el tablero?');
    if (confirmar) {
      numerosMarcados = [];
      localStorage.removeItem('numerosMarcados');
      restaurarEstadoTablero();
    }
  });

  // 6. Botón Seleccionar Todos (Útil para pruebas rápidas)
  if (btnSeleccionarTodos) {
    btnSeleccionarTodos.addEventListener('click', () => {
      numerosMarcados = Array.from({ length: TOTAL_NUMEROS }, (_, i) => i + 1);
      localStorage.setItem('numerosMarcados', JSON.stringify(numerosMarcados));
      restaurarEstadoTablero();
    });
  }

  // Inicialización
  restaurarEstadoTablero();
});
