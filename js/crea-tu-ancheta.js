// index.js

document.addEventListener("DOMContentLoaded", async () => {
  const productosLista = document.getElementById("productos-lista");
  const botonesCategoria = document.querySelectorAll(".btn-categoria");
  const modal = document.getElementById("modal");
  const cerrarModal = document.getElementById("cerrar-modal");

  let productos = [];

  // 1️⃣ Traer los productos generales desde el backend
  try {
    const resp = await fetch("http://localhost:3000/api/productos");
    productos = await resp.json();
  } catch (err) {
    console.error("Error cargando productos:", err);
  }

  // 2️⃣ Función para mostrar productos filtrados por categoría
  function mostrarProductos(categoria) {
    productosLista.innerHTML = "";

    const filtrados = productos.filter(p => p.categoria === categoria);

    if (filtrados.length === 0) {
      productosLista.innerHTML = "<p>No hay productos en esta categoría</p>";
      return;
    }

    filtrados.forEach(p => {
      const imgSrc = p.imagen?.startsWith("/") ? `http://localhost:3000${p.imagen}` : p.imagen;
      const productoHTML = `
        <div class="card-producto">
          <img src="${imgSrc}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p>$${p.precio.toLocaleString()}</p>
          <button class="agregar-carrito" data-id="${p.id}" data-nombre="${p.nombre}" data-precio="${p.precio}">Agregar</button>
        </div>
      `;
      productosLista.innerHTML += productoHTML;
    });

    // Activar botones "Agregar"
    document.querySelectorAll(".agregar-carrito").forEach(btn => {
      btn.addEventListener("click", () => {
        agregarAlPedido({
          id: btn.dataset.id,
          nombre: btn.dataset.nombre,
          precio: parseInt(btn.dataset.precio)
        });
      });
    });
  }

  // 3️⃣ Mostrar modal con productos al hacer click en categoría
  botonesCategoria.forEach(btn => {
    btn.addEventListener("click", () => {
      const categoria = btn.dataset.categoria;
      mostrarProductos(categoria);
      modal.classList.remove("oculto");
    });
  });

  // 4️⃣ Cerrar modal
  cerrarModal.addEventListener("click", () => {
    modal.classList.add("oculto");
  });

  // 5️⃣ Función para agregar productos al resumen
  const listaPedido = document.getElementById("lista-pedido");
  const totalSpan = document.getElementById("total");
  let total = 0;

  function agregarAlPedido(producto) {
    const li = document.createElement("li");
    li.textContent = `${producto.nombre} - $${producto.precio.toLocaleString()}`;
    listaPedido.appendChild(li);

    total += producto.precio;
    totalSpan.textContent = total.toLocaleString();
  }
});
