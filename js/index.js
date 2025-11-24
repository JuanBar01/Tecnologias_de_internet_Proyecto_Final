document.addEventListener("DOMContentLoaded", function () {
    const mainSection = document.querySelector(".main");
    const collectionSection = document.getElementById("collection");
    const createSection = document.getElementById("create");
    const backArrowRight = document.getElementById("back-arrow");
    const backArrowLeft = document.getElementById("back-arrow-left");

    // Mostrar “Anchetas de Colección”
    document.getElementById("right").addEventListener("click", function () {
        mainSection.style.display = "none";
        collectionSection.style.display = "flex";
    });

    // Mostrar “Crea tu Ancheta”
    document.getElementById("left").addEventListener("click", function () {
        mainSection.style.display = "none";
        createSection.style.display = "flex";
    });

    // Regresar desde “Anchetas de Colección”
    backArrowRight.addEventListener("click", function () {
        collectionSection.style.display = "none";
        mainSection.style.display = "flex";
    });

    // Regresar desde “Crea tu Ancheta”
    backArrowLeft.addEventListener("click", function () {
        createSection.style.display = "none";
        mainSection.style.display = "flex";
    });
});