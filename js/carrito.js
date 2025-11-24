// carrito.js
document.addEventListener("DOMContentLoaded", cargarCarrito);

function cargarCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contenedor = document.getElementById("carrito-container");
    const totalSpan = document.getElementById("total");

    contenedor.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
        total += Number(item.precio || 0);
        const div = document.createElement("div");
        div.classList.add("carrito-item");
        div.innerHTML = `
            <img src="${item.img}" alt="${item.nombre}">
            <div>
                <h3>${item.nombre}</h3>
                <p class="precio">$ ${Number(item.precio || 0)}</p>
            </div>
            <button class="btn-eliminar" data-index="${index}">Eliminar</button>
        `;
        contenedor.appendChild(div);
    });

    totalSpan.textContent = total;

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => {
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            carrito.splice(btn.dataset.index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            cargarCarrito();
        });
    });

    const vaciarBtn = document.getElementById("vaciar-carrito");
    if (vaciarBtn) {
        vaciarBtn.onclick = () => {
            localStorage.removeItem("carrito");
            cargarCarrito();
        };
    }
}
