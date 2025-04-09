// Elementos del DOM
const btnNuevoServicio = document.getElementById('btnNuevoServicio');
const btnCancelar = document.getElementById('btnCancelar');
const btnRegresar = document.getElementById('btnRegresar');
const servicioForm = document.getElementById('servicioForm');
const formContainer = document.getElementById('formContainer');
const listContainer = document.getElementById('listContainer');
const serviciosTableBody = document.getElementById('serviciosTableBody');

// Variables de estado
let isEditing = false;
let currentServicioId = null;

// Event Listeners
btnNuevoServicio.addEventListener('click', mostrarFormularioNuevo);
btnCancelar.addEventListener('click', ocultarFormulario);
btnRegresar.addEventListener('click', () => {
    window.location.href = 'http://localhost:4000/HTML/confServicios.html';
});
servicioForm.addEventListener('submit', handleFormSubmit);

// Cargar servicios al iniciar
cargarServicios();

// Funciones
function mostrarFormularioNuevo() {
    isEditing = false;
    currentServicioId = null;
    servicioForm.reset();
    formContainer.style.display = 'block';
    listContainer.style.display = 'none';
    document.getElementById('nombreServicio').focus();
}

function mostrarFormularioEditar(servicio) {
    isEditing = true;
    currentServicioId = servicio.id;

    document.getElementById('servicioId').value = servicio.id;
    document.getElementById('nombreServicio').value = servicio.NombreServicio;
    document.getElementById('costoServicio').value = servicio.CostoServicio;
    document.getElementById('imagenServicio').value = servicio.DirecImgServicio;
    document.getElementById('descripcionServicio').value = servicio.DescripcionServicio;

    formContainer.style.display = 'block';
    listContainer.style.display = 'none';
}

function ocultarFormulario() {
    formContainer.style.display = 'none';
    listContainer.style.display = 'block';
}

async function cargarServicios() {
    try {
        const response = await fetch('/verServHombres');
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al cargar servicios');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Error en la respuesta del servidor');
        }

        if (result.data.length === 0) {
            serviciosTableBody.innerHTML = 
                `<tr>
                    <td colspan="5" class="text-center py-4">
                        No hay servicios registrados actualmente
                    </td>
                </tr>`;
            return;
        }

        renderizarServicios(result.data);
    } catch (error) {
        console.error('Error:', error);
        serviciosTableBody.innerHTML = 
            `<tr>
                <td colspan="5" class="text-center text-danger py-4">
                    Error al cargar servicios: ${error.message}
                </td>
            </tr>`;
    }
}

function formatearCosto(valor) {
    try {
        const numero = parseFloat(valor);
        return !isNaN(numero) ? numero.toFixed(2) : '0.00';
    } catch (e) {
        return '0.00';
    }
}

function renderizarServicios(servicios) {
    serviciosTableBody.innerHTML = '';

    servicios.forEach(servicio => {
        const tr = document.createElement('tr');

        tr.innerHTML = 
            `<td>${servicio.DirecImgServicio}</td>
            <td>${servicio.NombreServicio}</td>
            <td>$${formatearCosto(servicio.CostoServicio)}</td>
            <td>${servicio.DescripcionServicio.substring(0, 50)}${servicio.DescripcionServicio.length > 50 ? '...' : ''}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-warning btn-editar" data-id="${servicio.id}">Editar</button>
                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${servicio.id}">Eliminar</button>
            </td>`;

        serviciosTableBody.appendChild(tr);
    });

    // Event listeners mejorados para los botones de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            try {
                const response = await fetch(`/hombres/${id}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al obtener servicio');
                }
                
                const result = await response.json();
                if (!result.success || !result.data) {
                    throw new Error(result.error || 'Servicio no encontrado');
                }
                
                mostrarFormularioEditar(result.data);
            } catch (error) {
                console.error('Error al obtener servicio:', error);
                alert('Error al cargar servicio: ' + error.message);
                
                // Recargar la lista si hay un error
                cargarServicios();
            }
        });
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            if (confirm('¿Estás seguro de eliminar este servicio?')) {
                eliminarServicio(id);
            }
        });
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();

    // Validación básica en el cliente
    const nombreServicio = document.getElementById('nombreServicio').value.trim();
    const costoServicio = document.getElementById('costoServicio').value.trim();
    const imagenServicio = document.getElementById('imagenServicio').value.trim();
    const descripcionServicio = document.getElementById('descripcionServicio').value.trim();

    if (!nombreServicio || !costoServicio || !imagenServicio || !descripcionServicio) {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    // Validar que el costo sea un número
    const costoNumerico = parseFloat(costoServicio);
    if (isNaN(costoNumerico)) {
        alert('El costo debe ser un valor numérico');
        return;
    }

    const servicioData = {
        DirecImgServicio: imagenServicio,
        NombreServicio: nombreServicio,
        CostoServicio: costoNumerico,
        DescripcionServicio: descripcionServicio
    };

    try {
        let response;
        if (isEditing) {
            // Asegurarnos que estamos pasando el ID correctamente
            response = await fetch(`/actualizarHombre/${currentServicioId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(servicioData)
            });
        } else {
            response = await fetch('/hombres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(servicioData)
            });
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al guardar servicio');
        }

        // Verificar si estamos en modo edición o creación
        if (isEditing) {
            if (result.data && result.data.id === currentServicioId) {
                alert('Servicio actualizado exitosamente');
            } else {
                throw new Error('El servicio no se actualizó correctamente');
            }
        } else {
            alert('Servicio creado exitosamente');
        }
        
        ocultarFormulario();
        cargarServicios();

    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar: ' + error.message);
    }
}

async function eliminarServicio(id) {
    try {
        const response = await fetch(`/hombres/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al eliminar servicio');
        }

        alert('Servicio eliminado exitosamente');
        cargarServicios();

    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar: ' + error.message);
    }
}
