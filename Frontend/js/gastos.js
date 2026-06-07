// gastos.js — RF-006, RF-007, RF-008, RF-009, RF-010, RF-011, RF-023, RF-024

// Estado en memoria (en producción esto viene del backend)
let gastos = [
  { id:1, nombre:'Arriendo',  categoria:'Vivienda',  monto:800000, fecha:'2026-06-01', ciclo:'mensual',  color:'#22c55e', activo:true },
  { id:2, nombre:'Luz',       categoria:'Servicios', monto:120500, fecha:'2026-08-15', ciclo:'mensual',  color:'#3563e9', activo:true },
  { id:3, nombre:'Gas',       categoria:'Servicios', monto:93000,  fecha:'2026-03-05', ciclo:'mensual',  color:'#ef4444', activo:true },
  { id:4, nombre:'Agua',      categoria:'Servicios', monto:115000, fecha:'2026-08-15', ciclo:'mensual',  color:'#06b6d4', activo:true },
  { id:5, nombre:'Netflix',   categoria:'Ocio',      monto:27900,  fecha:'2026-09-10', ciclo:'mensual',  color:'#eab308', activo:true },
];

let editingId = null;

// RF-023: calcular estado según fecha
function getStatus(fechaStr) {
  const hoy   = new Date();
  const fecha = new Date(fechaStr + 'T12:00:00');
  const diff  = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
  if (diff < 0)  return { label: 'Vencido',   cls: 'badge-red' };
  if (diff === 0) return { label: 'Hoy',       cls: 'badge-today' };
  if (diff <= 5)  return { label: `${diff}d`,  cls: 'badge-yellow' };
  return { label: 'Pendiente', cls: 'badge-yellow' };
}

// Formatear fecha
function fmtFecha(str) {
  const d = new Date(str + 'T12:00:00');
  return d.toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' });
}

// Renderizar tabla RF-006 RF-007 RF-011 RF-023
function renderGastos(lista) {
  lista = lista || gastos.filter(g => g.activo);
  const tbody = document.getElementById('gastos-tbody');
  if (!tbody) return;
  tbody.innerHTML = lista.map(g => {
    const st = getStatus(g.fecha);
    return `
      <tr>
        <td>
          <span class="service-cell">
            <span class="color-dot" style="background:${g.color}"></span>
            ${g.nombre}
          </span>
        </td>
        <td>${g.categoria}</td>
        <td>$${g.monto.toLocaleString('es-CO')}</td>
        <td>${fmtFecha(g.fecha)}</td>
        <td>${g.ciclo}</td>
        <td><span class="badge ${st.cls}">${st.label}</span></td>
        <td>
          <button class="action-btn" onclick="openEdit(${g.id})" title="Editar">✏️</button>
          <button class="action-btn del" onclick="softDelete(${g.id})" title="Eliminar">🗑️</button>
        </td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--gray-400);padding:24px">Sin recibos registrados</td></tr>';
}

// RF-021: filtrar
function filterGastos() {
  const q      = (document.getElementById('search2')?.value || '').toLowerCase();
  const cat    = document.getElementById('filter-cat')?.value   || '';
  const status = document.getElementById('filter-status')?.value || '';

  let lista = gastos.filter(g => g.activo);
  if (q)      lista = lista.filter(g => g.nombre.toLowerCase().includes(q));
  if (cat)    lista = lista.filter(g => g.categoria === cat);
  if (status) lista = lista.filter(g => getStatus(g.fecha).label === status);
  renderGastos(lista);
}

// RF-006: agregar gasto con RF-024 validación
function addGasto() {
  const nombre    = document.getElementById('new-nombre');
  const monto     = document.getElementById('new-monto');
  const fecha     = document.getElementById('new-fecha');
  const categoria = document.getElementById('new-categoria').value;
  const ciclo     = document.getElementById('new-ciclo').value;
  const color     = document.getElementById('new-color').value;
  let valid = true;

  // RF-024: validar campos obligatorios y monto positivo
  const setErr = (id, cond) => {
    document.getElementById(id).classList.toggle('error', cond);
    if (cond) valid = false;
  };
  setErr('ff-nombre', !nombre.value.trim());
  setErr('ff-monto',  !monto.value || Number(monto.value) <= 0);
  setErr('ff-fecha',  !fecha.value);

  if (!valid) return;

  const nuevo = {
    id:        Date.now(),
    nombre:    nombre.value.trim(),
    categoria: categoria || 'Otro',
    monto:     Number(monto.value),
    fecha:     fecha.value,
    ciclo,
    color,
    activo:    true
  };

  gastos.unshift(nuevo);
  renderGastos();
  closeModal('modal-nuevo');

  // Limpiar
  nombre.value = ''; monto.value = ''; fecha.value = '';
  showToast('Gasto agregado ✓');
}

// RF-008: abrir edición
function openEdit(id) {
  editingId = id;
  const g = gastos.find(x => x.id === id);
  if (!g) return;
  document.getElementById('edit-nombre').value    = g.nombre;
  document.getElementById('edit-categoria').value = g.categoria;
  document.getElementById('edit-monto').value     = g.monto;
  document.getElementById('edit-fecha').value     = g.fecha;
  document.getElementById('edit-ciclo').value     = g.ciclo;
  document.getElementById('edit-color').value     = g.color;
  openModal('modal-editar');
}

// RF-008: guardar edición
function saveEdit() {
  const g = gastos.find(x => x.id === editingId);
  if (!g) return;
  g.nombre    = document.getElementById('edit-nombre').value;
  g.categoria = document.getElementById('edit-categoria').value;
  g.monto     = Number(document.getElementById('edit-monto').value);
  g.fecha     = document.getElementById('edit-fecha').value;
  g.ciclo     = document.getElementById('edit-ciclo').value;
  g.color     = document.getElementById('edit-color').value;
  renderGastos();
  closeModal('modal-editar');
  showToast('Gasto actualizado ✓');
}

// RF-009: borrado lógico (soft delete)
function softDelete(id) {
  const g = gastos.find(x => x.id === (id || editingId));
  if (g) g.activo = false; // no se borra, solo se marca inactivo
  renderGastos();
  closeModal('modal-editar');
  showToast('Recibo eliminado (guardado en historial)');
}

// ── Helpers modales ──
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// Init
document.addEventListener('DOMContentLoaded', () => renderGastos());