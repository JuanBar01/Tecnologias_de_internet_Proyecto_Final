// ============================
// BOTÓN CERRAR SESIÓN
// ============================
const btnLogout = document.getElementById("btn-logout");
btnLogout?.addEventListener("click", () => {
    sessionStorage.removeItem("adminLogged");
    window.location.href = "../pages/iniciar-sesion.html";
});

// ============================
// FUNCIONES
// ============================

// Función genérica para cargar productos y mostrarlos en el contenedor dado
async function cargarProductos(tipo) {
    try {
        const url = tipo === "general"
            ? "http://localhost:3000/api/productos"
            : "http://localhost:3000/api/productos/coleccion";

        const resp = await fetch(url, { credentials: "include" });
        const productos = await resp.json();

        const contenedorId = tipo === "general" ? "productos-general" : "productos";
        const contenedor = document.getElementById(contenedorId);
        contenedor.innerHTML = "";

        productos.forEach(p => {
            const descripcionLista = p.descripcion
                ? p.descripcion.split(/\r?\n/).map(linea => `<li>${linea}</li>`).join("")
                : "<li>Sin descripción</li>";

            const imagen = p.imagen?.startsWith("/") ? `http://localhost:3000${p.imagen}` : p.imagen;

            contenedor.innerHTML += `
                <div class="card" data-id="${p.id}" data-nombre="${p.nombre}" data-precio="${p.precio}" data-tipo="${p.tipo}" data-img="${imagen}">
                    <div class="card-inner">
                        <div class="card-front">
                            <img src="${imagen}" alt="${p.nombre}">
                            <h3>${p.nombre}</h3>
                            <div class="precio">$${p.precio.toLocaleString()}</div>
                        </div>
                        <div class="card-back">
                            <h3>Detalles</h3>
                            <ul>${descripcionLista}</ul>
                            <button class="btn-eliminar">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
        });

        activarBotonesEliminar();

    } catch (error) {
        console.error(`Error cargando productos de ${tipo}:`, error);
        alert(`No se pudieron cargar los productos de ${tipo}.`);
    }
}

// Agregar producto general
async function agregarProductoGeneral() {
    const form = document.getElementById("form-producto-general");
    const data = new FormData(form);

    try {
        const resp = await fetch("http://localhost:3000/api/productos", {
            method: "POST",
            body: data,
            credentials: "include"
        });

        const resultado = await resp.json();
        alert(resultado.mensaje || "Producto general agregado");
        form.reset();
        cargarProductos("general"); // recarga lista
    } catch (err) {
        console.error("Error agregando producto general:", err);
        alert("No se pudo agregar el producto general.");
    }
}

// Agregar producto de colección
async function agregarProductoColeccion() {
    const form = document.getElementById("form-producto-coleccion");
    const data = new FormData(form);

    try {
        const resp = await fetch("http://localhost:3000/api/productos/coleccion", {
            method: "POST",
            body: data,
            credentials: "include"
        });

        const resultado = await resp.json();
        alert(resultado.mensaje || "Producto de colección agregado");
        form.reset();
        cargarProductos("coleccion"); // recarga lista
    } catch (err) {
        console.error("Error agregando producto de colección:", err);
        alert("No se pudo agregar el producto de colección.");
    }
}

// Activar botones eliminar
function activarBotonesEliminar() {
    const botones = document.querySelectorAll(".btn-eliminar");

    botones.forEach(boton => {
        boton.addEventListener("click", async () => {
            const card = boton.closest(".card");
            const productoId = card.dataset.id;
            const tipo = card.dataset.tipo;

            if (confirm(`¿Deseas eliminar "${card.dataset.nombre}"?`)) {
                try {
                    const url = tipo === "general"
                        ? `http://localhost:3000/api/productos/${productoId}`
                        : `http://localhost:3000/api/productos/coleccion/${productoId}`;

                    await fetch(url, {
                        method: "DELETE",
                        credentials: "include"
                    });

                    card.remove();

                } catch (error) {
                    console.error("Error eliminando producto:", error);
                    alert("No se pudo eliminar el producto");
                }
            }
        });
    });
}

// ============================
// INICIO
// ============================
document.addEventListener("DOMContentLoaded", () => {
    // Verificar sesión admin
    if (sessionStorage.getItem("adminLogged") !== "true") {
        alert("Debes iniciar sesión como administrador");
        window.location.href = "../pages/iniciar-sesion.html";
        return;
    }

    // Cargar productos al inicio
    cargarProductos("general");
    cargarProductos("coleccion");

    // Formularios
    const formGeneral = document.getElementById("form-producto-general");
    formGeneral?.addEventListener("submit", async e => {
        e.preventDefault();
        await agregarProductoGeneral();
    });

    const formColeccion = document.getElementById("form-producto-coleccion");
    formColeccion?.addEventListener("submit", async e => {
        e.preventDefault();
        await agregarProductoColeccion();
    });
});
