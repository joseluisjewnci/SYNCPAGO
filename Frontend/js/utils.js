let toastTimer;

// ====================
// TOAST
// ====================

function showToast(msg) {

    const t =
        document.getElementById("toast");

    if (!t) return;

    t.textContent = msg;

    t.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        t.classList.remove("show");
    }, 3000);
}


// ====================
// MONEDA
// ====================

const exchangeRates = {
    COP: 1,
    USD: 4000,
    EUR: 4500
};

function getCurrency() {

    return (
        localStorage.getItem("currency")
        || "COP"
    );
}

function setCurrency(currency) {

    localStorage.setItem(
        "currency",
        currency
    );

    showToast(
        "Moneda cambiada a " +
        currency
    );

    location.reload();
}

function formatMoney(value) {

    const currency =
        getCurrency();

    let amount = value;

    if (currency === "USD") {
        amount = value / exchangeRates.USD;
    }

    if (currency === "EUR") {
        amount = value / exchangeRates.EUR;
    }

    return new Intl.NumberFormat(
        currency === "COP"
            ? "es-CO"
            : "en-US",
        {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 2
        }
    ).format(amount);
}


// ====================
// FECHAS
// ====================

function formatDate(str) {

    return new Date(
        str + "T12:00:00"
    ).toLocaleDateString(
        "es-CO",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}
