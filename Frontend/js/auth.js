// auth.js — RF-001, RF-002, RF-003, RF-004, RF-005

// RF-002: Simula login y guarda token JWT
function login(email, password) {
  // Aquí va la llamada real al backend:
  // fetch('/api/auth/login', { method:'POST', body: JSON.stringify({email, password}) })
  const fakeToken = 'jwt-token-' + btoa(email);
  const fakeUser  = { name: email.split('@')[0], email };
  localStorage.setItem('token', fakeToken);
  localStorage.setItem('user',  JSON.stringify(fakeUser));
  window.location.href = 'dashboard.html';
}

// RF-001: Simula registro
function register(name, email, phone, password) {
  const fakeToken = 'jwt-token-' + btoa(email);
  const user = { name, email, phone };
  localStorage.setItem('token', fakeToken);
  localStorage.setItem('user',  JSON.stringify(user));
  window.location.href = 'dashboard.html';
}

// RF-003: Recuperar contraseña
function forgotPassword(email) {
  console.log('Enviando enlace de recuperación a:', email);
  // fetch('/api/auth/forgot-password', { method:'POST', body: JSON.stringify({email}) })
}

// RF-004: Cerrar sesión — invalida token en cliente
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// RF-005: Guard — redirige si no hay token
function requireAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
  } else {
    // Cargar datos de usuario en la UI
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const nameEl = document.getElementById('username-display');
    const welEl  = document.getElementById('welcome-name');
    const emailEl = document.getElementById('email-display');
    if (nameEl)  nameEl.textContent  = user.name || 'Usuario';
    if (welEl)   welEl.textContent   = user.name || 'Usuario';
    if (emailEl) emailEl.textContent = user.email || '';
  }
}