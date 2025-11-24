  // Lista de productos
  const productosPorCategoria = {
    dulces: [
      { nombre: "Chocolate Hershey's", precio: 5000, imagen:"../assets/image 17.png" },
      { nombre: "Chocolate Jet", precio: 4000, imagen:"../assets/image 19.png" },
      { nombre: "Chocolate M&M's", precio: 6000, imagen:"../assets/image 20.png" },
      { nombre: "Chocolate Jumbo", precio: 4500, imagen:"../assets/image 16.png" },
      { nombre: "Chocolate Ferrero Rocher", precio: 7000, imagen:"../assets/image 18.png" },
    ],
    bebidas: [
      { nombre: "Jugo Natural", precio: 3500, imagen:"../assets/image 15.png" },
      { nombre: "Gaseosa", precio: 4000, imagen:"../assets/image 14.png" },
      { nombre: "Vino Tinto", precio: 15000, imagen:"../assets/image 11.png" },
      { nombre: "Cerveza", precio: 5000, imagen:"../assets/image 13.png" },
      { nombre: "Champagne", precio: 25000, imagen:"../assets/image 12.png" },
    ],
    detalles: [
      { nombre: "Flores", precio: 10000, imagen:"../assets/image 8.png" },
      { nombre: "Carta decorada", precio: 3000, imagen:"../assets/image 9.png" },
      { nombre: "Peluches", precio: 12000, imagen:"../assets/image 6.png" },
      { nombre: "Velas aromatizadas", precio: 4000, imagen:"../assets/image 10.png" },
      { nombre: "Globos", precio: 2000, imagen:"../assets/image 7.png" },
    ],
    envolturas: [
      { nombre: "Caja de mimbre tradicional", precio: 8000, imagen:"../assets/image 1.png" },
      { nombre: "Caja de madera decorativa", precio: 10000, imagen:"../assets/image 2.png" },
      { nombre: "Caja de carton con diseño", precio: 6000, imagen:"../assets/image 3.png" },
      { nombre: "Bolsa ecológica reutilizable", precio: 6000, imagen:"../assets/image 4.png" },
      { nombre: "Lazo grande de satín", precio: 4500, imagen:"../assets/image 5.png" },
    ],
  };

  // Elementos del DOM
  const modal = document.getElementById("modal");
  const listaProductos = document.getElementById("productos-lista");
  const tituloModal = document.getElementById("titulo-modal");
  const cerrarModal = document.getElementById("cerrar-modal");
  const listaPedido = document.getElementById("lista-pedido");
  const totalHTML = document.getElementById("total");
  const extrasInputs = document.getElementById("extras-inputs");
  const mensajeCheckbox = document.getElementById("mensaje");
  const sorpresaCheckbox = document.getElementById("sorpresa");
  
  //const AgregarExtra = document.getElementById("agregarExtra");

  let total = 0;


  // Mostrar productos de una categoría
  document.querySelectorAll(".btn-categoria").forEach((btn) => {
    btn.addEventListener("click", () => {
      const categoria = btn.dataset.categoria;
      mostrarModal(categoria);
    });
  });

  function mostrarModal(categoria) {
    listaProductos.innerHTML = "";
    tituloModal.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);

    productosPorCategoria[categoria].forEach((p) => {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}" class="img-producto">
        <p><strong>${p.nombre}</strong></p>
        <p>$${p.precio.toLocaleString()}</p>
      `;
      div.addEventListener("click", () => agregarAlPedido(p));
      listaProductos.appendChild(div);
    });

    modal.classList.remove("oculto");
  }

  // Cerrar modal
  cerrarModal.addEventListener("click", () => {
    modal.classList.add("oculto");
  });

  function agregarAlPedido(producto) {
    // Asume producto = { nombre, precio (number), imagen (ruta relativa) }
    const li = document.createElement("li");
    li.classList.add("item-pedido");

    // Guardamos metadatos en data-attributes (útiles para pasar al carrito)
    li.dataset.nombre = producto.nombre;
    li.dataset.precio = producto.precio; // número
    li.dataset.img = producto.imagen || "";

    // Estructura más clara y separada (imagen | info | botón)
    const imgSrc = encodeURI(producto.imagen || "");
    li.innerHTML = `
      <div class="item-left">
        <img src="${imgSrc}" alt="${producto.nombre}" class="mini-img">
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

      // handler del botón eliminar (resta total y quita el li)
      btnEliminar.addEventListener("click", () => {
        const precio = parseFloat(li.dataset.precio) || 0;
        total = Math.max(0, total - precio);
        totalHTML.textContent = total.toLocaleString();
        li.remove();
      });


    listaPedido.appendChild(li);
    li.appendChild(btnEliminar);
    // Actualiza total (asegúrate que 'total' y 'totalHTML' existen en tu script)
    total += Number(producto.precio || 0);
    totalHTML.textContent = total.toLocaleString();
  }



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

      // Click "Agregar"
      boton.addEventListener("click", () => {
        const texto = input.value.trim();
        if (!texto) {
          alert("Por favor escribe algo antes de agregarlo 💬");
          return;
        }

        // Crear LI para el resumen con clase para styling
        const li = document.createElement("li");
        li.className = "item-pedido";

        const span = document.createElement("span");
        span.className = "nombre";
        span.textContent = `${icono} ${texto}`;

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "btn-eliminar";
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", () => {
          li.remove();
          // restaurar UI del wrapper (para poder volver a agregar)
          boton.disabled = false;
          boton.textContent = boton.dataset.originalText;
          input.disabled = false;
          input.value = "";
          // opcional: si el item tenía precio, restarlo del total (aquí extras no llevan precio)
        });

        li.appendChild(span);
        li.appendChild(botonEliminar);
        listaPedido.appendChild(li);

        // animación de aparición
        setTimeout(() => li.classList.add("aparecer"), 10);

        // bloquear el campo y botón
        boton.textContent = "Agregado ✓";
        boton.disabled = true;
        input.disabled = true;
      });

      wrapper.appendChild(input);
      wrapper.appendChild(boton);
      return wrapper;
  };

  mensajeCheckbox.addEventListener("change", () => {
    const existente = document.querySelector("#mensaje-wrapper");
    if (mensajeCheckbox.checked) {
      if (!existente) {
        const wrapper = crearCampoConBoton(
          "mensaje-texto",
          "Escribe aquí tu mensaje personalizado...",
          "📝Mensaje:",
          "Agregar mensaje"
        );
        wrapper.id = "mensaje-wrapper";
        mensajeCheckbox.parentElement.insertAdjacentElement("afterend", wrapper);
        setTimeout(() => wrapper.classList.add("visible"), 10);
      }
    } else {
      existente?.remove();
    }
  });

  sorpresaCheckbox.addEventListener("change", () => {
    const existente = document.querySelector("#sorpresa-wrapper");
      if (sorpresaCheckbox.checked) {
        if (!existente) {
          const wrapper = crearCampoConBoton(
            "sorpresa-detalle",
            "Describe tu sorpresa extra...",
            "🎁 Sorpresa:",
            "Agregar sorpresa"
          );
          wrapper.id = "sorpresa-wrapper";
          sorpresaCheckbox.parentElement.insertAdjacentElement("afterend", wrapper);
          setTimeout(() => wrapper.classList.add("visible"), 10);
        }
      } else {
        existente?.remove();
      }
  });

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

    document.querySelectorAll('input[type="checkbox"]:checked').forEach(check => {
      const nombreExtra = check.nextSibling.textContent.trim();
      let icono = "";

      // Escoger ícono según el tipo de extra
      if (nombreExtra.toLowerCase().includes("mensaje")) {
        icono = '<i class="fa-solid fa-envelope"></i>';
      } else if (nombreExtra.toLowerCase().includes("sorpresa")) {
        icono = '<i class="fa-solid fa-gift"></i>';
      } else {
        icono = '<i class="fa-solid fa-star"></i>';
      }

    });

    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizar contador del carrito
    const carritoCount = document.getElementById("carrito-count");
    if (carritoCount) carritoCount.textContent = carrito.length;

    // Limpiar resumen
    document.getElementById("lista-pedido").innerHTML = "";
    total = 0;
    document.getElementById("total").textContent = "0";

    // Redirigir al carrito
    //window.location.href = "../pages/carrito.html";
  });
}


  



