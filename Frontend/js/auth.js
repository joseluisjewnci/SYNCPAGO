// ======================
// LOGIN
// ======================

async function login(email, password) {

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo: email,
          password: password
        })
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert(data.mensaje);
      return;
    }

    localStorage.setItem(
      "token",
      "usuario-autenticado"
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.usuario)
    );

    window.location.href = "dashboard.html";

  } catch (error) {

    console.error(error);

    alert("Error al iniciar sesión");
  }
}


// ======================
// REGISTRO
// ======================

async function register(name, email, phone, password) {

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: name,
          correo: email,
          password: password
        })
      }
    );

    const data = await response.json();

    alert(data.mensaje);

    if (data.success) {
      window.location.href = "index.html";
    }

  } catch (error) {

    console.error(error);

    alert("Error al registrar usuario");
  }
}


// ======================
// LOGOUT
// ======================

function logout() {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "index.html";
}


// ======================
// AUTH GUARD
// ======================

function requireAuth() {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const nombre =
    user.nombre ||
    user.name ||
    "Usuario";

  const correo =
    user.correo ||
    user.email ||
    "";

  const username =
    document.getElementById("username-display");

  const welcome =
    document.getElementById("welcome-name");

  const email =
    document.getElementById("email-display");

  const fullname =
    document.getElementById("fullname-display");

  if (username) {
    username.textContent = nombre;
  }

  if (welcome) {
    welcome.textContent = nombre;
  }

  if (email) {
    email.textContent = correo;
  }

  if (fullname) {
    fullname.textContent = nombre;
  }
}