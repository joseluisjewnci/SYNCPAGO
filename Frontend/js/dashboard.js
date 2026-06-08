document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const nombre =
        user.nombre ||
        user.name ||
        "Usuario";

    const username =
        document.getElementById("username-display");

    const fullname =
        document.getElementById("fullname-display");

    const email =
        document.getElementById("email-display");

    const welcome =
        document.getElementById("welcome-name");

    if (username) {
        username.textContent = nombre;
    }

    if (fullname) {
        fullname.textContent = nombre;
    }

    if (email) {
        email.textContent =
            user.correo ||
            user.email ||
            "";
    }

    if (welcome) {
        welcome.textContent =
            nombre.split(" ")[0];
    }

});