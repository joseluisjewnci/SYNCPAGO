// utils.js — Helpers generales

let toastTimer;

// Toast de notificación
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// Formatear número como moneda
function formatMoney(n, currency = 'COP') {
  return new Intl.NumberFormat('es-CO', {
    style:    'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(n);
}

// Formatear fecha legible
function formatDate(str) {
  return new Date(str + 'T12:00:00').toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}