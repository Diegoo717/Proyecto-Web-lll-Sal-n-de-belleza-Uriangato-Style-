document.addEventListener('DOMContentLoaded', function() {
    const btnRegresar = document.getElementById('btnRegresar');
    const btnNuevoServicio = document.getElementById('btnNuevoServicio');
    const btnCancelar = document.getElementById('btnCancelar');
    const servicioForm = document.getElementById('servicioForm');
    const formContainer = document.getElementById('formContainer');
    const listContainer = document.getElementById('listContainer');
    const serviciosTableBody = document.getElementById('serviciosTableBody');

    const servicioId = document.getElementById('servicioId');
    const nombreServicio = document.getElementById('nombreServicio');
    const costoServicio = document.getElementById('costoServicio');
    const imagenServicio = document.getElementById('imagenServicio');
    const descripcionServicio = document.getElementById('descripcionServicio');
    const imgPreview = document.getElementById('imgPreview');

    const API_BASE_URL = 'http://localhost:4000'; 

    btnRegresar.addEventListener('click', () => {
        window.location.href = '/HTML/confServicios.html'; 
    });

    btnNuevoServicio.addEventListener('click', mostrarFormularioNuevo);
    btnCancelar.addEventListener('click', ocultarFormulario);
    servicioForm.addEventListener('submit', manejarEnvioFormulario);
    imagenServicio.addEventListener('input', actualizarVistaPreviaImagen);

    cargarServicios();


    function mostrarFormularioNuevo() {
        servicioId.value = '';
        servicioForm.reset();
        imgPreview.innerHTML = '';
        formContainer.style.display = 'block';
        listContainer.style.display = 'none';
        nombreServicio.focus();
    }

    function mostrarFormularioEdicion(servicio) {
        servicioId.value = servicio.id;
        nombreServicio.value = servicio.NombreServicio;
        costoServicio.value = servicio.CostoServicio;
        imagenServicio.value = servicio.DirecImgServicio;
        descripcionServicio.value = servicio.DescripcionServicio;
        
        // Actualizar vista previa de imagen
        actualizarVistaPreviaImagen();
        
        formContainer.style.display = 'block';
        listContainer.style.display = 'none';
        nombreServicio.focus();
    }

    function ocultarFormulario() {
        formContainer.style.display = 'none';
        listContainer.style.display = 'block';
    }

    function actualizarVistaPreviaImagen() {
        const url = imagenServicio.value;
        imgPreview.innerHTML = url ? 
            `<img src="${url}" alt="Vista previa" class="img-thumbnail" style="max-height: 150px;">` : 
            '<div class="alert alert-info">No hay imagen para mostrar</div>';
    }

    async function cargarServicios() {
        try {
            const response = await fetch(`${API_BASE_URL}/servNino/verServNinos`);
            const data = await response.json();
            
            if (data.success) {
                renderizarServicios(data.data);
            } else {
                mostrarError('Error al cargar servicios: ' + (data.error || 'Desconocido'));
            }
        } catch (error) {
            mostrarError('Error al conectar con el servidor: ' + error.message);
        }
    }

    function renderizarServicios(servicios) {
        serviciosTableBody.innerHTML = '';
        
        if (servicios.length === 0) {
            serviciosTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No hay servicios registrados</td>
                </tr>
            `;
            return;
        }
        
        servicios.forEach(servicio => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <img src="${servicio.DirecImgServicio}" alt="${servicio.NombreServicio}" 
                         class="img-thumbnail" style="max-height: 80px;">
                </td>
                <td>${servicio.NombreServicio}</td>
                <td>$${servicio.CostoServicio.toFixed(2)}</td>
                <td>${servicio.DescripcionServicio.substring(0, 50)}${servicio.DescripcionServicio.length > 50 ? '...' : ''}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-editar" data-id="${servicio.id}">Editar</button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${servicio.id}">Eliminar</button>
                </td>
            `;
            serviciosTableBody.appendChild(tr);
        });
        
        // Agregar event listeners a los botones dinámicos
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                await cargarServicioParaEditar(id);
            });
        });
        
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                confirmarEliminacion(id);
            });
        });
    }

    async function cargarServicioParaEditar(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/servNino/ninos/${id}`);
            const data = await response.json();
            
            if (data.success) {
                mostrarFormularioEdicion(data.data);
            } else {
                mostrarError('Error al cargar servicio: ' + (data.error || 'Desconocido'));
            }
        } catch (error) {
            mostrarError('Error al conectar con el servidor: ' + error.message);
        }
    }

    async function manejarEnvioFormulario(e) {
        e.preventDefault();
        
        const servicio = {
            DirecImgServicio: imagenServicio.value,
            NombreServicio: nombreServicio.value,
            CostoServicio: parseFloat(costoServicio.value),
            DescripcionServicio: descripcionServicio.value
        };
        
        try {
            let response;
            if (servicioId.value) {
                response = await fetch(`${API_BASE_URL}/servNino/actualizarNino/${servicioId.value}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(servicio)
                });
            } else {
                response = await fetch(`${API_BASE_URL}/servNino/ninos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(servicio)
                });
            }
            
            const data = await response.json();
            
            if (response.ok) {
                mostrarExito(servicioId.value ? 'Servicio actualizado correctamente' : 'Servicio creado correctamente');
                ocultarFormulario();
                cargarServicios();
            } else {
                mostrarError('Error: ' + (data.error || 'Error desconocido'));
            }
        } catch (error) {
            mostrarError('Error al conectar con el servidor: ' + error.message);
        }
    }

    function confirmarEliminacion(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
            eliminarServicio(id);
        }
    }

    async function eliminarServicio(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/servNino/ninos/${id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                mostrarExito('Servicio eliminado correctamente');
                cargarServicios();
            } else {
                mostrarError('Error al eliminar servicio: ' + (data.error || 'Desconocido'));
            }
        } catch (error) {
            mostrarError('Error al conectar con el servidor: ' + error.message);
        }
    }

    function mostrarExito(mensaje) {
        alertify.success(mensaje); 
    }

    function mostrarError(mensaje) {
        alertify.error(mensaje); 
    }
});