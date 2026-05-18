document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('tablero-grid');
  const btnReiniciar = document.getElementById('btn-reiniciar');
  const btnSeleccionarTodos = document.getElementById('btn-todos');
  const valSalidos = document.getElementById('val-salidos');
  const valRestantes = document.getElementById('val-restantes');
  
  // Modal de confirmación personalizado
  const modal = document.getElementById('custom-confirm-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const btnModalConfirm = document.getElementById('btn-modal-confirm');
  const btnModalCancel = document.getElementById('btn-modal-cancel');
  
  const TOTAL_NUMEROS = 90;
  let numerosMarcados = [];
  let callbackConfirmacion = null;

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

  // --- Lógica del Modal de Confirmación ---
  const abrirConfirmacion = (titulo, mensaje, accion, esPeligroso = false) => {
    modalTitle.textContent = titulo;
    modalMessage.textContent = mensaje;
    callbackConfirmacion = accion;
    
    if (esPeligroso) {
      btnModalConfirm.className = 'btn btn-danger';
      btnModalConfirm.textContent = 'Confirmar';
    } else {
      btnModalConfirm.className = 'btn btn-primary';
      btnModalConfirm.textContent = 'Aceptar';
    }
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    btnModalConfirm.focus();
  };

  const cerrarConfirmacion = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    callbackConfirmacion = null;
  };

  btnModalConfirm.addEventListener('click', () => {
    if (callbackConfirmacion) callbackConfirmacion();
    cerrarConfirmacion();
  });

  btnModalCancel.addEventListener('click', cerrarConfirmacion);
  
  // Cerrar al hacer clic fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarConfirmacion();
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      cerrarConfirmacion();
    }
  });

  // 5. Botón Reiniciar con Modal Personalizado
  btnReiniciar.addEventListener('click', () => {
    if (numerosMarcados.length === 0) return;
    
    abrirConfirmacion(
      '¿Reiniciar tablero?',
      'Esta acción vaciará por completo el tablero y el almacenamiento local.',
      () => {
        numerosMarcados = [];
        localStorage.removeItem('numerosMarcados');
        restaurarEstadoTablero();
      },
      true // Acción de peligro
    );
  });

  // 6. Botón Seleccionar Todos con Modal Personalizado
  if (btnSeleccionarTodos) {
    btnSeleccionarTodos.addEventListener('click', () => {
      if (numerosMarcados.length === TOTAL_NUMEROS) return;

      abrirConfirmacion(
        '¿Marcar todos?',
        'Se marcarán los 90 números del tablero como salidos.',
        () => {
          numerosMarcados = Array.from({ length: TOTAL_NUMEROS }, (_, i) => i + 1);
          localStorage.setItem('numerosMarcados', JSON.stringify(numerosMarcados));
          restaurarEstadoTablero();
        },
        false // Acción normal
      );
    });
  }

  // --- Lógica de Pantalla Completa y Rotación Móvil ---
  const btnFullscreen = document.getElementById('btn-fullscreen');

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          // Entrar en pantalla completa
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          } else if (document.documentElement.webkitRequestFullscreen) { // Safari/iOS
            await document.documentElement.webkitRequestFullscreen();
          }

          // Intentar bloquear orientación a horizontal (landscape)
          if (screen.orientation && screen.orientation.lock) {
            try {
              await screen.orientation.lock('landscape');
            } catch (err) {
              console.log('El bloqueo de orientación no es soportado o fue rechazado:', err);
            }
          }
        } else {
          // Salir de pantalla completa
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            await document.webkitExitFullscreen();
          }
          
          // Desbloquear orientación
          if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
          }
        }
      } catch (error) {
        console.error('Error al cambiar modo pantalla completa:', error);
      }
    });

    // Escuchar cambios de pantalla completa para sincronizar el estado del botón
    const alCambiarPantallaCompleta = () => {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        btnFullscreen.textContent = 'Salir ⛶';
        btnFullscreen.setAttribute('aria-label', 'Salir de pantalla completa');
        btnFullscreen.classList.replace('btn-secondary', 'btn-primary');
      } else {
        btnFullscreen.textContent = 'Pantalla Completa ⛶';
        btnFullscreen.setAttribute('aria-label', 'Pantalla completa y girar horizontalmente');
        btnFullscreen.classList.replace('btn-primary', 'btn-secondary');
        
        // Desbloquear orientación por seguridad al salir
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      }
    };

    document.addEventListener('fullscreenchange', alCambiarPantallaCompleta);
    document.addEventListener('webkitfullscreenchange', alCambiarPantallaCompleta);
  }

  // Inicialización
  restaurarEstadoTablero();
});
