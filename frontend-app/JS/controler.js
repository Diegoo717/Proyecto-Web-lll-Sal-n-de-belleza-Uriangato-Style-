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

document.addEventListener('DOMContentLoaded', function() {
    const articles = document.querySelectorAll('.art-div-section, .art-aside-index');
    
    function randomPulse() {
        // Detener cualquier animación previa
        articles.forEach(article => {
            article.classList.remove('random-pulse');
            // Forzar reflow para reiniciar la animación
            void article.offsetWidth;
        });
        
        // Seleccionar 1-3 artículos al azar
        const count = Math.floor(Math.random() * 3) + 1;
        const selectedArticles = [];
        
        while(selectedArticles.length < count) {
            const randomIndex = Math.floor(Math.random() * articles.length);
            if(!selectedArticles.includes(articles[randomIndex])) {
                selectedArticles.push(articles[randomIndex]);
            }
        }
        
        // Aplicar animación con escala aleatoria
        selectedArticles.forEach(article => {
            let scale;
            if (article.id === "art-div-section-7") { // Solo para el artículo 7
                scale = (Math.random() * 0.1) + 1.05; // Escala muy pequeña (1.01 a 1.06)
            } else {
                scale = (Math.random() * 0.3) + 1.05; // Escala normal (1.05 a 1.35)
            }
            article.style.setProperty('--scale-amount', scale);
            article.classList.add('random-pulse');
        });
    }
    
    // Ejecutar 4 veces con 1s de intervalo, luego esperar 4s
    function runAnimationSequence() {
        let counter = 0;
        const interval = setInterval(() => {
            randomPulse();
            counter++;
            if(counter >= 4) {
                clearInterval(interval);
                setTimeout(runAnimationSequence, 4000); // Esperar 4s antes de reiniciar
            }
        }, 1000);
    }
    
    // Iniciar la secuencia
    runAnimationSequence();
});