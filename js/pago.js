// -------------------------
// REFERENCIAS DOM
// -------------------------
const modal = document.getElementById("modal-productos");
const listaProductos = document.getElementById("lista-productos");
const tituloModal = document.getElementById("titulo-modal");
const cerrarModal = document.getElementById("cerrar-modal");

const listaPedido = document.getElementById("lista-pedido");
const totalHTML = document.getElementById("total");

const finalizarBtn = document.getElementById("finalizar-pedido");

// Extras
const extrasInputs = document.querySelectorAll(".extra input");
const mensajeCheckbox = document.getElementById("extra-mensaje");
const sorpresaCheckbox = document.getElementById("extra-sorpresa");

// Carrito temporal
let pedido = JSON.parse(localStorage.getItem("carrito")) || [];

// -------------------------
// OBTENER PRODUCTOS POR CATEGORÍA
// -------------------------
async function obtenerProductos(categoria) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/productos/categoria/${categoria}`
    );
    if (!res.ok) throw new Error("Error obteniendo productos");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// -------------------------
// MOSTRAR MODAL
// -------------------------
async function mostrarModal(categoria) {
  listaProductos.innerHTML = "";
  tituloModal.textContent =
    categoria.charAt(0).toUpperCase() + categoria.slice(1);

  const productos = await obtenerProductos(categoria);

  if (productos.length === 0) {
    listaProductos.innerHTML = "<p>No hay productos disponibles</p>";
    modal.classList.remove("oculto");
    return;
  }

  productos.forEach((p) => {
    const imgSrc = p.imagen
      ? `http://localhost:3000${p.imagen}`
      : "";

    const item = document.createElement("div");
    item.classList.add("producto");

    item.innerHTML = `
      <img src="${imgSrc}" class="img-producto">
      <p><strong>${p.nombre}</strong></p>
      <p>$${Number(p.precio).toLocaleString()}</p>
    `;

    item.addEventListener("click", () => {
      agregarAlPedido({
        id: p.id,
        nombre: p.nombre,
        precio: Number(p.precio),
        imagen: imgSrc,
        cantidad: 1
      });
    });

    listaProductos.appendChild(item);
  });

  modal.classList.remove("oculto");
}

// -------------------------
// AGREGAR ITEM AL PEDIDO
// -------------------------
function agregarAlPedido(producto) {
  pedido.push(producto);
  guardarPedido();
  cargarPedidoEnHTML();
}

// -------------------------
// GUARDAR / CARGAR
// -------------------------
function guardarPedido() {
  localStorage.setItem("carrito", JSON.stringify(pedido));
}

function cargarPedidoEnHTML() {
  listaPedido.innerHTML = "";

  if (pedido.length === 0) {
    listaPedido.innerHTML = "<p>Tu ancheta está vacía</p>";
    totalHTML.textContent = "$0";
    return;
  }

  pedido.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("item-pedido");

    div.innerHTML = `
      <img src="${item.imagen}" class="img-mini">
      <span>${item.nombre}</span>
      <span>$${item.precio.toLocaleString()}</span>
      <button class="eliminar" data-index="${index}">X</button>
    `;

    div.querySelector(".eliminar").addEventListener("click", () => {
      pedido.splice(index, 1);
      guardarPedido();
      cargarPedidoEnHTML();
    });

    listaPedido.appendChild(div);
  });

  const total = pedido.reduce((sum, p) => sum + p.precio, 0);
  totalHTML.textContent = "$" + total.toLocaleString();
}

cargarPedidoEnHTML();

// -------------------------
// CERRAR MODAL
// -------------------------
cerrarModal.addEventListener("click", () => {
  modal.classList.add("oculto");
});

// -------------------------
// FINALIZAR PEDIDO (MANDAR A BACKEND)
// -------------------------
finalizarBtn.addEventListener("click", async () => {
  if (pedido.length === 0) {
    alert("No puedes finalizar una ancheta vacía");
    return;
  }

  const items = pedido.map((item) => ({
    id: item.id || null,
    cantidad: 1,
    precio: item.precio,
  }));

  const total = items.reduce((sum, i) => sum + i.precio, 0);

  try {
    const res = await fetch("http://localhost:3000/api/ordenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre_cliente: "Cliente Web",
        email_cliente: "cliente@correo.com",
        direccion: "Dirección de prueba",
        total,
        items
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    alert("Orden creada con éxito. ID: " + data.orderId);

    localStorage.removeItem("carrito");
    pedido = [];
    cargarPedidoEnHTML();

  } catch (err) {
    alert("Error creando orden: " + err.message);
  }
});
