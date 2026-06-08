const translations = {

    es: {
        inicio: "Inicio",
        recibos: "Mis Recibos",
        recordatorios: "Recordatorios",
        estadisticas: "Estadísticas",
        historial: "Historial"
    },

    en: {
        inicio: "Home",
        recibos: "My Bills",
        recordatorios: "Reminders",
        estadisticas: "Statistics",
        historial: "History"
    }

};

let currentLang =
    localStorage.getItem("lang")
    || "es";

function setLang(lang) {

    localStorage.setItem(
        "lang",
        lang
    );

    location.reload();
}

function getLang() {

    return (
        localStorage.getItem("lang")
        || "es"
    );
}