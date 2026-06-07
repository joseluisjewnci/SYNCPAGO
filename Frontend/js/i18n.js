// i18n.js — RF-022: Soporte Bilingüe ES/EN

const translations = {
  es: {
    'nav.inicio':         'Inicio',
    'nav.Recibos':         'Mis Recibos',
    'nav.recordatorios':  'Recordatorios',
    'nav.insights':       'Estadísticas',
    'nav.historial':      'Historial',
    'nav.agregar':        '+ Agregar Recibo',
    'search.placeholder': 'Buscar Recibos...',
    'badge.hoy':          'Hoy',
    'badge.pendiente':    'Pendiente',
    'badge.vencido':      'Vencido',
    'badge.pagado':       'Pagado',
    'btn.confirmar':      'Confirmar',
    'btn.guardar':        'Guardar cambios',
    'btn.eliminar':       'Eliminar',
    'btn.cerrar':         'Cerrar sesión',
  },
  en: {
    'nav.inicio':         'Home',
    'nav.recibos':         'My Expenses',
    'nav.recordatorios':  'Reminders',
    'nav.insights':       'Estadísticas',
    'nav.historial':      'History',
    'nav.agregar':        '+ Add Expense',
    'search.placeholder': 'Search expenses...',
    'badge.hoy':          'Today',
    'badge.pendiente':    'Pending',
    'badge.vencido':      'Overdue',
    'badge.pagado':       'Paid',
    'btn.confirmar':      'Confirm',
    'btn.guardar':        'Save changes',
    'btn.eliminar':       'Delete',
    'btn.cerrar':         'Log out',
  }
};

let currentLang = localStorage.getItem('lang') || 'es';

// Traduce un key
function t(key) {
  return translations[currentLang]?.[key] || key;
}

// RF-022: cambiar idioma
function setLang(lang, btn) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  btn?.classList.add('active');
  applyTranslations();
}

// Aplica traducciones a elementos con data-i18n
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

document.addEventListener('DOMContentLoaded', applyTranslations);