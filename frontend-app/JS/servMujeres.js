document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://localhost:4000';
    const API_PREFIX = '/servMujer';
    const ENDPOINT = '/verServMujeres';

    const contenedorPrincipal = document.querySelector('.bodyServiciosMujer');

    async function cargarServicios() {
        try {
            const seccionesExistentes = document.querySelectorAll('.serviciosDeMujer');
            seccionesExistentes.forEach(sec => sec.style.display = 'none');
            
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-message';
            loadingDiv.innerHTML = '<p>Cargando servicios...</p>';
            contenedorPrincipal.insertBefore(loadingDiv, contenedorPrincipal.firstChild);

            const response = await fetch(`${API_BASE_URL}${API_PREFIX}${ENDPOINT}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                loadingDiv.remove();
                seccionesExistentes.forEach(sec => sec.style.display = 'block');
                renderizarServicios(data.data);
            } else {
                mostrarError('Error al cargar servicios: ' + (data.error || 'Desconocido'));
                loadingDiv.innerHTML = `
                    <p class="error-mensaje">Error al cargar los servicios. Intenta recargar la página.</p>
                    <button onclick="location.reload()" class="btn-reintentar">Reintentar</button>
                `;
            }
        } catch (error) {
            console.error('Error al cargar servicios:', error);
            mostrarError('Error de conexión: ' + error.message);
            const errorDiv = document.querySelector('.loading-message') || document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `
                <p class="error-mensaje">Error al conectar con el servidor. Verifica tu conexión e intenta nuevamente.</p>
                <button onclick="location.reload()" class="btn-reintentar">Reintentar</button>
            `;
            if (!document.querySelector('.loading-message')) {
                contenedorPrincipal.insertBefore(errorDiv, contenedorPrincipal.firstChild);
            }
        }
    }

    function renderizarServicios(servicios) {
        const categorias = {};
        
        servicios.forEach(servicio => {
            if (!categorias[servicio.Categoria]) {
                categorias[servicio.Categoria] = [];
            }
            categorias[servicio.Categoria].push(servicio);
        });

        for (const [categoria, serviciosCategoria] of Object.entries(categorias)) {
            let seccion = document.querySelector(`section h2:contains('${categoria}')`)?.parentNode;
            
            if (!seccion) {
                seccion = document.createElement('section');
                seccion.className = 'serviciosDeMujer';
                
                const titulo = document.createElement('h2');
                titulo.textContent = categoria;
                seccion.appendChild(titulo);
                
                contenedorPrincipal.appendChild(seccion);
            }

            const serviciosExistentes = seccion.querySelectorAll('.servicioMujerDesglosado');
            serviciosExistentes.forEach(s => s.remove());

            serviciosCategoria.forEach(servicio => {
                const servicioDiv = document.createElement('div');
                servicioDiv.className = 'servicioMujerDesglosado';
                
                const imagen = document.createElement('img');
                imagen.src = servicio.DirecImgServicio || '../Resources/imagenes/default-service.jpg';
                imagen.alt = servicio.NombreServicio;
                
                const titulo = document.createElement('h3');
                titulo.textContent = servicio.NombreServicio;
                
                const precio = document.createElement('div');
                precio.className = 'precio';
                precio.textContent = `$${servicio.CostoServicio.toFixed(2)}`;
                
                const descripcion = document.createElement('p');
                descripcion.textContent = servicio.DescripcionServicio;
                
                servicioDiv.appendChild(imagen);
                servicioDiv.appendChild(titulo);
                servicioDiv.appendChild(precio);
                servicioDiv.appendChild(descripcion);
                
                seccion.appendChild(servicioDiv);
            });
        }
    }

    function mostrarError(mensaje) {
        console.error(mensaje);
    }

    cargarServicios();
});