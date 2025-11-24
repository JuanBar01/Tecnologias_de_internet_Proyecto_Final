// ============================
// BOTÓN CERRAR SESIÓN
// ============================
const btnLogout = document.getElementById("btn-logout");
btnLogout?.addEventListener("click", () => {
    sessionStorage.removeItem("adminLogged");
    window.location.href = "../pages/iniciar-sesion.html";
});

// ============================
// AGREGAR PRODUCTOS
// ============================
async function agregarProducto(tipo) {
    const form = tipo === "general"
        ? document.getElementById("form-producto-general")
        : document.getElementById("form-producto-coleccion");

    const data = new FormData(form);

    try {
        const url = tipo === "general"
            ? "http://localhost:3000/api/productos"
            : "http://localhost:3000/api/productos/coleccion";

        const resp = await fetch(url, { method: "POST", body: data, credentials: "include" });
        const resultado = await resp.json();
        alert(resultado.mensaje || "Producto agregado");
    } catch (err) {
        console.error("Error agregando producto:", err);
    }
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

    // Cargar productos
    cargarProductos("general");
    cargarProductos("coleccion");

    // Formularios
    const formGeneral = document.getElementById("form-producto-general");
    formGeneral?.addEventListener("submit", async e => {
        e.preventDefault();
        await agregarProducto("general");
        formGeneral.reset();
        cargarProductos("general");
    });

    const formColeccion = document.getElementById("form-producto-coleccion");
    formColeccion?.addEventListener("submit", async e => {
        e.preventDefault();
        await agregarProducto("coleccion");
        formColeccion.reset();
        cargarProductos("coleccion");
    });
});






document.addEventListener("DOMContentLoaded", async () => {
  try {
    const respuesta = await fetch("http://localhost:3000/api/productos/coleccion");
    const productos = await respuesta.json();

    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    productos.forEach(p => {
      const descripcionLista = p.descripcion
        ? p.descripcion.split(/\r?\n/).map(linea => `<li>${linea}</li>`).join("")
        : "<li>Sin descripción</li>";

      const imagen = p.imagen?.startsWith("/") ? `http://localhost:3000${p.imagen}` : p.imagen;

      contenedor.innerHTML += `
        <div class="card" data-id="${p.id}" data-nombre="${p.nombre}" data-precio="${p.precio}" data-img="${imagen}">
          <div class="card-inner">
            <div class="card-front">
              <img src="${imagen}" alt="${p.nombre}">
              <h3>${p.nombre}</h3>
              <div class="precio">$${p.precio.toLocaleString()}</div>
            </div>
            <div class="card-back">
              <h3>Detalles</h3>
              <ul>${descripcionLista}</ul>
              <button class="btn-compra"> Eliminar</button>
            </div>
          </div>
        </div>
      `;
    });

    activarBotonesEliminar();
  } catch (error) {
    console.error("Error cargando productos de colección:", error);
  }
});
// Botón eliminar para administrador
function activarBotonesEliminar() {
  const botones = document.querySelectorAll(".btn-compra"); // si quieres, cambia la clase a "btn-eliminar"
  
  botones.forEach(boton => {
    boton.addEventListener("click", async () => {
      const card = boton.closest(".card");
      const productoId = card.dataset.id;

      if (confirm(`¿Deseas eliminar "${card.dataset.nombre}"?`)) {
        try {
          await fetch(`http://localhost:3000/api/productos/coleccion/${productoId}`, {
            method: "DELETE",
            credentials: "include" // importante si tu backend requiere sesión
          });

          // Quita la carta del DOM
          card.remove();

        } catch (error) {
          console.error("Error eliminando producto:", error);
          alert("No se pudo eliminar el producto");
        }
      }
    });
  });
}
