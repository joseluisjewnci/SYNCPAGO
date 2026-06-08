// ======================
// TOAST
// ======================

let toastTimer;

function showToast(msg) {

  const t =
    document.getElementById("toast");

  if (!t) return;

  t.textContent = msg;

  t.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    t.classList.remove("show");

  }, 2800);
}


// ======================
// MONEDA
// ======================

let currentCurrency =
  localStorage.getItem("currency") || "COP";


function setCurrency(currency) {

  currentCurrency = currency;

  localStorage.setItem(
    "currency",
    currency
  );

  updateMoneyValues();
}


function convertCurrency(value) {

  switch (currentCurrency) {

    case "USD":
      return value / 4000;

    case "EUR":
      return value / 4500;

    default:
      return value;
  }
}


function formatMoney(value) {

  return new Intl.NumberFormat(
    "es-CO",
    {
      style: "currency",
      currency: currentCurrency,
      minimumFractionDigits: 0
    }
  ).format(
    convertCurrency(value)
  );
}


// ======================
// ACTUALIZAR MONTOS
// ======================

function updateMoneyValues() {

  document
    .querySelectorAll("[data-money]")
    .forEach(el => {

      const value =
        Number(el.dataset.money);

      el.textContent =
        formatMoney(value);
    });
}


// ======================
// FECHAS
// ======================

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


// ======================
// CARGA INICIAL
// ======================

document.addEventListener(
  "DOMContentLoaded",
  updateMoneyValues
);