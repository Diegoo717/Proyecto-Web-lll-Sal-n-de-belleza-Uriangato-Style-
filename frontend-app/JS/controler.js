const article1 = document.querySelector("#art-div-section-1");
const article2 = document.querySelector("#art-div-section-2");
const article3 = document.querySelector("#art-div-section-3");
const article4 = document.querySelector("#art-div-section-4");
const article5 = document.querySelector("#art-div-section-5");
const article6 = document.querySelector("#art-div-section-6");
const article7 = document.querySelector("#art-div-section-7");

article1.addEventListener("click", () => {
    window.location.href = "serviciosMujer.html";
});
article2.addEventListener("click", () => {
    window.location.href = "/HTML/serviciosHombre.html";
});
article3.addEventListener("click", () => {
    window.location.href = "/HTML/Niños.html";
});
article4.addEventListener("click", () => {
    window.location.href = "/HTML/contacto.html";
});
article5.addEventListener("click", () => {
    window.location.href = "/HTML/galeria.html";
});
article6.addEventListener("click", () => {
    window.location.href = "/HTML/Blog.html";
});
article7.addEventListener("click", () => {
    window.location.href = "/HTML/agendarCita.html";
});
