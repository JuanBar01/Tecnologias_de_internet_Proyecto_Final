// Cargar solo productos de colección
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
              <button class="btn-compra">🛒 Comprar</button>
            </div>
          </div>
        </div>
      `;
    });

    activarBotones();
  } catch (error) {
    console.error("Error cargando productos de colección:", error);
  }
});

// Agregar al carrito
function activarBotones() {
  const botones = document.querySelectorAll(".btn-compra");
  const contador = document.getElementById("carrito-count");

  let total = parseInt(contador?.textContent) || 0;

  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      const card = boton.closest(".card");
      const item = {
        id: card.dataset.id,
        nombre: card.dataset.nombre,
        img: card.dataset.img,
        precio: parseInt(card.dataset.precio),
        cantidad: 1
      };

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      carrito.push(item);
      localStorage.setItem("carrito", JSON.stringify(carrito));

      total++;
      if (contador) contador.textContent = total;
    });
  });
}
