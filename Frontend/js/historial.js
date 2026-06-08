let historial = JSON.parse(
    localStorage.getItem("gastos")
) || [];

let paginaActual = 1;
const registrosPorPagina = 8;

function formatMoney(valor) {
    return "$" + valor.toLocaleString("es-CO");
}

function fmtFecha(str) {
    const d = new Date(str + "T12:00:00");

    return d.toLocaleDateString(
        "es-CO",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}

function getEstado(gasto) {

    if (!gasto.activo) {
        return {
            texto: "Eliminado",
            clase: ""
        };
    }

    const hoy = new Date();

    const fecha = new Date(
        gasto.fecha + "T12:00:00"
    );

    const diff = Math.ceil(
        (fecha - hoy) /
        (1000 * 60 * 60 * 24)
    );

    if (diff < 0) {
        return {
            texto: "Vencido",
            clase: "badge-red"
        };
    }

    if (diff === 0) {
        return {
            texto: "Hoy",
            clase: "badge-today"
        };
    }

    return {
        texto: "Pendiente",
        clase: "badge-yellow"
    };
}

function renderHistorial(lista = historial) {

    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                lista.length /
                registrosPorPagina
            )
        );

    if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas;
    }

    const inicio =
        (paginaActual - 1) *
        registrosPorPagina;

    const fin =
        inicio +
        registrosPorPagina;

    const pagina =
        lista.slice(inicio, fin);

    const tbody =
        document.getElementById(
            "hist-tbody"
        );

    if (!tbody) return;

    tbody.innerHTML = pagina.map(g => {

        const estado =
            getEstado(g);

        return `
        <tr ${!g.activo ? 'style="opacity:.6"' : ''}>

            <td>
                <span class="service-cell">
                    <span
                        class="color-dot"
                        style="background:${g.color}">
                    </span>

                    ${g.nombre}
                </span>
            </td>

            <td>${g.categoria}</td>

            <td>${formatMoney(g.monto)}</td>

            <td>${fmtFecha(g.fecha)}</td>

            <td>

                ${
                    estado.texto === "Eliminado"

                    ?

                    `<span
                        class="badge"
                        style="background:#f1f5f9;color:#64748b;">
                        Eliminado
                    </span>`

                    :

                    `<span class="badge ${estado.clase}">
                        ${estado.texto}
                    </span>`
                }

            </td>

        </tr>
        `;
    }).join("");

    if (pagina.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td
                colspan="5"
                style="
                text-align:center;
                padding:24px;">
                No hay registros
            </td>
        </tr>
        `;
    }

    document.getElementById(
        "hist-pag-info"
    ).textContent =
        `Página ${paginaActual} de ${totalPaginas}`;

    document.getElementById(
        "hist-pag-num"
    ).textContent =
        `${paginaActual} de ${totalPaginas}`;

    document.getElementById(
        "hist-prev"
    ).disabled =
        paginaActual === 1;

    document.getElementById(
        "hist-next"
    ).disabled =
        paginaActual === totalPaginas;
}

function changeHistPage(direccion) {

    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                historial.length /
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

    renderHistorial();
}

function filterHistorial() {

    const texto =
        document.getElementById("hist-q")
        ?.value
        .toLowerCase() || "";

    const categoria =
        document.getElementById("hist-cat")
        ?.value || "";

    const estado =
        document.getElementById("hist-status")
        ?.value || "";

    let lista = [...historial];

    if (texto) {

        lista = lista.filter(
            g =>
            g.nombre
            .toLowerCase()
            .includes(texto)
        );
    }

    if (categoria) {

        lista = lista.filter(
            g =>
            g.categoria === categoria
        );
    }

    if (estado) {

        lista = lista.filter(
            g =>
            getEstado(g).texto === estado
        );
    }

    paginaActual = 1;

    renderHistorial(lista);
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderHistorial();

        document
            .getElementById("hist-prev")
            ?.addEventListener(
                "click",
                () => changeHistPage(-1)
            );

        document
            .getElementById("hist-next")
            ?.addEventListener(
                "click",
                () => changeHistPage(1)
            );
    }
);