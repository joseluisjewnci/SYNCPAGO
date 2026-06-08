// ======================
// TRADUCCIONES
// ======================

const translations = {

  es: {

    inicio: "Inicio",
    recibos: "Mis Recibos",
    recordatorios: "Recordatorios",
    estadisticas: "Estadísticas",
    historial: "Historial",
    agregar: "+ Agregar Recibo",
    cerrar: "Cerrar sesión"

  },

  en: {

    inicio: "Home",
    recibos: "My Bills",
    recordatorios: "Reminders",
    estadisticas: "Statistics",
    historial: "History",
    agregar: "+ Add Bill",
    cerrar: "Log out"

  }
};


let currentLang =
  localStorage.getItem("lang") || "es";


// ======================
// CAMBIAR IDIOMA
// ======================

function setLang(lang, btn) {

  currentLang = lang;

  localStorage.setItem(
    "lang",
    lang
  );

  document
    .querySelectorAll(".lang-btn")
    .forEach(b => b.classList.remove("active"));

  if (btn) {
    btn.classList.add("active");
  }

  applyTranslations();
}


// ======================
// APLICAR TRADUCCIONES
// ======================

function applyTranslations() {

  const t = translations[currentLang];

  document.querySelectorAll("[data-i18n]")
    .forEach(el => {

      const key =
        el.getAttribute("data-i18n");

      if (t[key]) {
        el.textContent = t[key];
      }
    });
}


// ======================
// CARGA INICIAL
// ======================

document.addEventListener(
  "DOMContentLoaded",
  applyTranslations
);