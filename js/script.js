// ===========================================
// JS CREA-TU-ANCHETA - ADMINISTRACIÓN DE PRODUCTOS
// ===========================================

// Elementos del DOM
const modal = document.getElementById("modal");
const listaProductos = document.getElementById("productos-lista");
const tituloModal = document.getElementById("titulo-modal");
const cerrarModal = document.getElementById("cerrar-modal");
const listaPedido = document.getElementById("lista-pedido");
const totalHTML = document.getElementById("total");
const mensajeCheckbox = document.getElementById("mensaje");
const sorpresaCheckbox = document.getElementById("sorpresa");

let total = 0;

// Guardar productos por categoría
let productosPorCategoria = {
  dulces: [],
  bebidas: [],
  detalles: [],
  envolturas: []
};

// ----------------------
// FETCH PRODUCTOS
// ----------------------
async function cargarProductos() {
  try {
    const res = await fetch("http://localhost:3000/api/productos");
    const productos = await res.json();

    // Limpiar categorías
    for (let cat in productosPorCategoria) productosPorCategoria[cat] = [];

    productos.forEach(p => {
      switch (p.categoria.toLowerCase()) {
        case "dulces":
          productosPorCategoria.dulces.push(p);
          break;
        case "bebidas":
          productosPorCategoria.bebidas.push(p);
          break;
        case "detalles especiales":
          productosPorCategoria.detalles.push(p);
          break;
        case "envolturas":
          productosPorCategoria.envolturas.push(p);
          break;
      }
    });

  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

// ----------------------
// MOSTRAR MODAL
// ----------------------
function mostrarModal(categoriaNombre) {
  listaProductos.innerHTML = "";
  tituloModal.textContent = categoriaNombre.charAt(0).toUpperCase() + categoriaNombre.slice(1);

  const productos = productosPorCategoria[categoriaNombre] || [];

  productos.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <img src="${p.imagen ? `http://localhost:3000${p.imagen}` : '..//default.png'}" alt="${p.nombre}" class="img-producto">
      <p class="nombre-producto"><strong>${p.nombre}</strong></p>
      <p class="precio-producto">$${Number(p.precio).toLocaleString()}</p>
    `;
    div.addEventListener("click", () => agregarAlPedido(p));
    listaProductos.appendChild(div);
  });

  modal.classList.remove("oculto");
}

// ----------------------
// CERRAR MODAL
// ----------------------
cerrarModal.addEventListener("click", () => {
  modal.classList.add("oculto");
});

// ----------------------
// AGREGAR AL PEDIDO
// ----------------------
function agregarAlPedido(producto) {
  const li = document.createElement("li");
  li.classList.add("item-pedido");
  li.dataset.nombre = producto.nombre;
  li.dataset.precio = producto.precio;
  li.dataset.img = producto.imagen || "";

  li.innerHTML = `
    <div class="item-left">
      <img src="${producto.imagen ? `http://localhost:3000${producto.imagen}` : '../assets/default.png'}" alt="${producto.nombre}" class="mini-img">
    </div>
    <div class="item-center">
      <h4 class="nombre">${producto.nombre}</h4>
      <p class="precio"> $${Number(producto.precio).toLocaleString()}</p>
    </div>
  `;

  const btnEliminar = document.createElement("button");
  btnEliminar.type = "button";
  btnEliminar.className = "btn-eliminar";
  btnEliminar.textContent = "Eliminar";
  btnEliminar.addEventListener("click", () => {
    const precio = Number(li.dataset.precio) || 0;
    total = Math.max(0, total - precio);
    totalHTML.textContent = total.toLocaleString();
    li.remove();
  });

  li.appendChild(btnEliminar);
  listaPedido.appendChild(li);

  total += Number(producto.precio || 0);
  totalHTML.textContent = total.toLocaleString();
}

// ----------------------
// BOTONES CATEGORÍA
// ----------------------
document.querySelectorAll(".btn-categoria").forEach(btn => {
  btn.addEventListener("click", () => {
    const categoria = btn.dataset.categoria;
    mostrarModal(categoria);
  });
});

// ----------------------
// EXTRAS: MENSAJE Y SORPRESA
// ----------------------
function crearCampoConBoton(idCampo, placeholder, icono, textoLabel) {
  const wrapper = document.createElement("div");
  wrapper.className = "input-boton-wrapper";

  const input = document.createElement("textarea");
  input.id = idCampo;
  input.placeholder = placeholder;

  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = textoLabel;
  boton.className = "btn-agregar";
  boton.dataset.originalText = textoLabel;

  boton.addEventListener("click", () => {
    const texto = input.value.trim();
    if (!texto) return alert("Escribe algo antes de agregarlo 💬");

    const li = document.createElement("li");
    li.className = "item-pedido";

    const span = document.createElement("span");
    span.className = "nombre";
    span.innerHTML = `${icono} ${texto}`;

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn-eliminar";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => {
      li.remove();
      boton.disabled = false;
      boton.textContent = boton.dataset.originalText;
      input.disabled = false;
      input.value = "";
    });

    li.appendChild(span);
    li.appendChild(btnEliminar);
    listaPedido.appendChild(li);

    setTimeout(() => li.classList.add("aparecer"), 10);
    boton.textContent = "Agregado ✓";
    boton.disabled = true;
    input.disabled = true;
  });

  wrapper.appendChild(input);
  wrapper.appendChild(boton);
  return wrapper;
}

mensajeCheckbox.addEventListener("change", () => {
  const existente = document.querySelector("#mensaje-wrapper");
  if (mensajeCheckbox.checked) {
    if (!existente) {
      const wrapper = crearCampoConBoton("mensaje-texto", "Escribe aquí tu mensaje personalizado...", "📝Mensaje:", "Agregar mensaje");
      wrapper.id = "mensaje-wrapper";
      mensajeCheckbox.parentElement.insertAdjacentElement("afterend", wrapper);
      setTimeout(() => wrapper.classList.add("visible"), 10);
    }
  } else existente?.remove();
});

sorpresaCheckbox.addEventListener("change", () => {
  const existente = document.querySelector("#sorpresa-wrapper");
  if (sorpresaCheckbox.checked) {
    if (!existente) {
      const wrapper = crearCampoConBoton("sorpresa-detalle", "Describe tu sorpresa extra...", "🎁 Sorpresa:", "Agregar sorpresa");
      wrapper.id = "sorpresa-wrapper";
      sorpresaCheckbox.parentElement.insertAdjacentElement("afterend", wrapper);
      setTimeout(() => wrapper.classList.add("visible"), 10);
    }
  } else existente?.remove();
});

// ----------------------
// FINALIZAR PEDIDO
// ----------------------
const finalizarBtn = document.getElementById("finalizar");
if (finalizarBtn) {
  finalizarBtn.addEventListener("click", () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    document.querySelectorAll("#lista-pedido li.item-pedido").forEach(li => {
      const nombre = li.dataset.nombre || li.querySelector(".nombre")?.textContent || li.textContent;
      const precio = Number(li.dataset.precio) || Number((li.querySelector(".precio")?.textContent || "").replace(/[^\d]/g, "")) || 0;
      const img = li.dataset.img ? encodeURI(li.dataset.img) : "";
      carrito.push({ nombre: nombre.trim(), precio: precio, img: img });
    });
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizar contador del carrito
    const carritoCount = document.getElementById("carrito-count");
    if (carritoCount) carritoCount.textContent = carrito.length;

    // Limpiar resumen
    listaPedido.innerHTML = "";
    total = 0;
    totalHTML.textContent = "0";
  });
}

// ----------------------
// INICIALIZACIÓN
// ----------------------
cargarProductos();
