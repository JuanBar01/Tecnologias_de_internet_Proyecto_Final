// pago.js

document.addEventListener("DOMContentLoaded", () => {
    const resumenCompra = document.getElementById("resumen-compra");
    const totalHTML = document.getElementById("total");

    // Recuperar carrito desde localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    let total = 0;

    if (carrito.length === 0) {
        resumenCompra.innerHTML = "<p>No hay productos en tu carrito.</p>";
        totalHTML.textContent = "0";
        return;
    }

    // Mostrar cada producto en el resumen (solo nombre y precio)
    carrito.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("item-compra");
        div.innerHTML = `
            <p><strong>${item.nombre}</strong> - $${Number(item.precio).toLocaleString()}</p>
        `;
        resumenCompra.appendChild(div);

        total += Number(item.precio || 0);
    });

    totalHTML.textContent = total.toLocaleString();

    // ----------------------
    // Manejar formulario de pago
    // ----------------------
    const formPago = document.getElementById("form-pago");
    formPago.addEventListener("submit", (e) => {
        e.preventDefault();

        // Aquí puedes agregar validaciones de pago

        alert("¡Pago realizado correctamente! Total: $" + total.toLocaleString());

        // Limpiar carrito y localStorage
        localStorage.removeItem("carrito");

        // Redirigir a otra página si quieres
        window.location.href = "../index.html";
    });
});
