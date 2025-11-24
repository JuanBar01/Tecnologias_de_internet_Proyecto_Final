document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-login-admin");

    // Revisar si ya está logueado
    if (sessionStorage.getItem("adminLogged") === "true") {
        // Redirigir directamente al panel de administrador
        window.location.href = "administrador.html"; // ajusta la ruta según tu proyecto
        return;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const usuario = document.getElementById("usuario").value.trim();
        const password = document.getElementById("password").value.trim();

        // Credenciales hardcodeadas
        const USUARIO_ADMIN = "admin";
        const PASSWORD_ADMIN = "1234";

        if (usuario === USUARIO_ADMIN && password === PASSWORD_ADMIN) {
            alert("Login exitoso");

            // Guardar estado de login en sessionStorage
            sessionStorage.setItem("adminLogged", "true");

            // Redirigir al panel de administrador
            window.location.href = "administrador.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
});
