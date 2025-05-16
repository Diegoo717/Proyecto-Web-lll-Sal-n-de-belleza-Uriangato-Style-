document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://localhost:4000';
    const API_PREFIX = '/servMujer';
    const ENDPOINT = '/verServMujeres';

    const body = document.querySelector('.bodyServiciosMujer');
    
    async function cargarServicios() {
        try {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-message serviciosDeMujer'; 
            loadingDiv.innerHTML = '<p>Cargando servicios...</p>';

            body.insertBefore(loadingDiv, document.querySelector('header').nextSibling);

            const response = await fetch(`${API_BASE_URL}${API_PREFIX}${ENDPOINT}`);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            
            const data = await response.json();
            
            if (data.success) {
                loadingDiv.remove();
                renderizarServicios(data.data);
            } else {
                throw new Error(data.error || 'Error en los datos recibidos');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarError(error.message);
        }
    }

    function renderizarServicios(servicios) {
    if (!servicios || !Array.isArray(servicios)) {
        throw new Error('Datos de servicios inválidos');
    }

    const mainContainer = document.createElement('div');
    mainContainer.className = 'serviciosDeMujer'; 

    servicios.forEach(servicio => {
        const card = document.createElement('div');
        card.className = 'servicioMujerDesglosado'; 
        
        card.innerHTML = `
            <img src="${servicio.DirecImgServicio || '../Resources/imagenes/default-service.jpg'}" 
                 alt="${servicio.NombreServicio}">
            <h3>${servicio.NombreServicio}</h3>
            <div class="precio">$${parseFloat(servicio.CostoServicio).toFixed(2)}</div>
            <p>${servicio.DescripcionServicio}</p>
        `;
        
        mainContainer.appendChild(card);
    });

    const header = document.querySelector('header');
    header.insertAdjacentElement('afterend', mainContainer);
}

    function mostrarError(mensaje) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message serviciosDeMujer'; 
        errorDiv.innerHTML = `
            <p class="error-mensaje">⚠️ ${mensaje}</p>
            <button class="btn-reintentar" onclick="window.location.reload()">Reintentar</button>
        `;
        
        body.insertBefore(errorDiv, document.querySelector('header').nextSibling);
    }

    cargarServicios();
});