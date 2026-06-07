const usuario = {
    nombre: "José Castillo",
    correo: "jose@gmail.com"
};

document.getElementById("username-display").textContent = usuario.nombre;
document.getElementById("fullname-display").textContent = usuario.nombre;
document.getElementById("email-display").textContent = usuario.correo;
document.getElementById("welcome-name").textContent = usuario.nombre.split(" ")[0];