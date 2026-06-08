// gastos.js — RF-006, RF-007, RF-008, RF-009, RF-010, RF-011, RF-023, RF-024

// Estado en memoria (en producción esto viene del backend)
let gastos = JSON.parse(
    localStorage.getItem("gastos")
) || [];

let paginaActual = 1;
const registrosPorPagina = 8;

function guardarGastos() {
    localStorage.setItem(
        "gastos",
        JSON.stringify(gastos)
    );
}

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

    const totalPaginas =
        Math.max(
            1,
            Math.ceil(lista.length / registrosPorPagina)
        );

    if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas;
    }

    const inicio =
        (paginaActual - 1) * registrosPorPagina;

    const fin =
        inicio + registrosPorPagina;

    const pagina =
        lista.slice(inicio, fin);

    const tbody =
        document.getElementById("gastos-tbody");

    if (!tbody) return;

    tbody.innerHTML = pagina.map(g => {

        const st = getStatus(g.fecha);

        return `
        <tr>
            <td>
                <span class="service-cell">
                    <span class="color-dot"
                    style="background:${g.color}">
                    </span>
                    ${g.nombre}
                </span>
            </td>

            <td>${g.categoria}</td>

            <td>${formatMoney(g.monto)}</td>

            <td>${fmtFecha(g.fecha)}</td>

            <td>${g.ciclo}</td>

            <td>
                <span class="badge ${st.cls}">
                    ${st.label}
                </span>
            </td>

            <td>
                <button
                    class="action-btn"
                    onclick="openEdit(${g.id})">
                    ✏️
                </button>

                <button
                    class="action-btn del"
                    onclick="softDelete(${g.id})">
                    🗑️
                </button>
            </td>
        </tr>
        `;
    }).join("");

    if (pagina.length === 0) {
        tbody.innerHTML = `
        <tr>
            <td colspan="7"
            style="text-align:center;padding:24px;">
                Sin recibos registrados
            </td>
        </tr>
        `;
    }

    document.getElementById("pag-info").textContent =
        `Página ${paginaActual} de ${totalPaginas}`;

    document.getElementById("pag-num").textContent =
        `${paginaActual} de ${totalPaginas}`;

    document.getElementById("btn-prev").disabled =
        paginaActual === 1;

    document.getElementById("btn-next").disabled =
        paginaActual === totalPaginas;
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
  paginaActual = 1;
  renderGastos(lista);
}
function changePage(direccion) {

    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                gastos.filter(g => g.activo).length /
                registrosPorPagina
            )
        );

    paginaActual += direccion;

    if (paginaActual < 1) {
        paginaActual = 1;
    }

    if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas;
    }

    renderGastos();
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

guardarGastos();

paginaActual = 1;

renderGastos();
  closeModal('modal-nuevo');

  // Limpiar
  nombre.value = ''; monto.value = ''; fecha.value = '';
  showToast('Recibo agregado✓');
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
  g.color = document.getElementById('edit-color').value;
  guardarGastos();
  renderGastos();
  closeModal('modal-editar');
  showToast('Gasto actualizado ✓');
}

// RF-009: borrado lógico (soft delete)
function softDelete(id) {

    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar este recibo?"
        );

    if (!confirmar) return;

    const g =
        gastos.find(
            x => x.id === (id || editingId)
        );

    if (g) {
        g.activo = false;
    }

    guardarGastos();

    renderGastos();

    closeModal("modal-editar");

    showToast("Recibo eliminado ✓");
}

// ── Helpers modales ──
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// Init
document.addEventListener('DOMContentLoaded', () => renderGastos());