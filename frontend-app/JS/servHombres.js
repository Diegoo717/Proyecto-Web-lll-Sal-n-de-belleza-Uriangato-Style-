document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://localhost:4000';
    const API_PREFIX = '/servHombre';
    const ENDPOINT = '/verServHombres';

    const contenedorPrincipal = document.getElementById('contenedorPrincipal');

    async function cargarServicios() {
        try {
            contenedorPrincipal.innerHTML = '<p>Cargando servicios...</p>';

            const response = await fetch(`${API_BASE_URL}${API_PREFIX}${ENDPOINT}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                renderizarServicios(data.data);
            } else {
                mostrarError('Error al cargar servicios: ' + (data.error || 'Desconocido'));
                contenedorPrincipal.innerHTML = `
                    <p class="error-mensaje">Error al cargar los servicios. Intenta recargar la página.</p>
                    <button onclick="location.reload()" class="btn-reintentar">Reintentar</button>
                `;
            }
        } catch (error) {
            console.error('Error al cargar servicios:', error);
            mostrarError('Error al conectar con el servidor: ' + error.message);
            contenedorPrincipal.innerHTML = `
                <p class="error-mensaje">Error de conexión. Verifica tu internet e intenta nuevamente.</p>
                <button onclick="location.reload()" class="btn-reintentar">Reintentar</button>
            `;
        }
    }

    function renderizarServicios(servicios) {
        contenedorPrincipal.innerHTML = '';

        if (servicios.length === 0) {
            contenedorPrincipal.innerHTML = '<p class="sin-servicios">No hay servicios disponibles en este momento.</p>';
            return;
        }

        servicios.forEach(servicio => {
            const seccion = document.createElement('section');
            seccion.className = 'secciones-serviciosHombre';

            const articulo = document.createElement('article');
            articulo.className = 'articleSH';
            
            const imagen = document.createElement('img');
            imagen.src = servicio.DirecImgServicio || 'https://via.placeholder.com/150'; 
            imagen.alt = servicio.NombreServicio;
            
            articulo.appendChild(imagen);

            const titulo = document.createElement('h3');
            titulo.textContent = servicio.NombreServicio;
            
            const precio = document.createElement('p');
            precio.className = 'precio-servicio';
            precio.textContent = `$${servicio.CostoServicio.toFixed(2)}`;
            
            const descripcion = document.createElement('p');
            descripcion.className = 'descripcion-servicio';
            descripcion.textContent = servicio.DescripcionServicio;

            seccion.appendChild(articulo);
            seccion.appendChild(titulo);
            seccion.appendChild(precio);
            seccion.appendChild(descripcion);

            contenedorPrincipal.appendChild(seccion);
        });
    }

    function mostrarError(mensaje) {
        console.error(mensaje);       
    }

    cargarServicios();
});