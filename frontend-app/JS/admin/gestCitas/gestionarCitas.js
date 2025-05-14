document.addEventListener('DOMContentLoaded', () => {
    // Add styling fixes
    applyStyleFixes();
    
    // Populate categories
    actualizarCategorias();
    
    // Set up category change event
    document.getElementById('categoria').addEventListener('change', actualizarServicios);
    
    // Load initial data
    obtenerCitas();

    // Setup form validation
    setupFormValidation();

    // Configurar el botón de cancelar
    const btnCancelar = document.getElementById('btnCancelar');
    const formularioCita = document.getElementById('formularioCita');

    if (btnCancelar && formularioCita) {
        btnCancelar.addEventListener("click", function() {
            formularioCita.style.display = "none";
            // Resetear el formulario al cancelar
            document.getElementById('formEditarCita').reset();
        });
    }
});

function applyStyleFixes() {
    // Fix form styling
    const formSection = document.getElementById('formularioCita');
    formSection.style.padding = '0 20px';
    formSection.style.maxHeight = '600px';  
    formSection.style.overflowY = 'visible'; 
    formSection.style.margin = '20px auto';
    formSection.style.boxSizing = 'border-box';
    formSection.style.marginLeft = '30px';
    
    // Make input widths consistent
    const inputFields = document.querySelectorAll('.input-campo');
    inputFields.forEach(input => {
        input.style.width = '100%';
        input.style.boxSizing = 'border-box';
    });
    
    // Make form responsive
    const formContainer = document.getElementById('formEditarCita');
    formContainer.style.width = '100%';
    formContainer.style.maxWidth = '600px';
    formContainer.style.margin = '0 auto';

    // Style for error messages
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            display: none;
        }
        .input-campo.invalid {
            border: 1px solid #dc3545;
        }
        .input-campo.valid {
            border: 1px solid #28a745;
        }

        .btn-eliminar {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
        }

        .btn-editar {
            background-color: rgb(98, 181, 124);  
        }
        
        .btn-editar:hover {
            background-color: rgb(30, 167, 46);
        }
        
        .btn-eliminar:hover {
            background-color: #c82333;
        }
        
        #btnCancelar {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
        }
        
        #btnCancelar:hover {
            background-color: #5a6268;
        }
    `;
    
    document.head.appendChild(style);
}

function setupFormValidation() {
    const formEditarCita = document.getElementById('formEditarCita');
    const nombreCompletoInput = document.getElementById('nombreCompleto');
    const emailInput = document.getElementById('email');
    const fechaHoraInput = document.getElementById('fechaHora');
    const categoriaSelect = document.getElementById('categoria');
    const servicioSelect = document.getElementById('servicio');
    
    addErrorMessageElement('nombreCompleto');
    addErrorMessageElement('email');
    addErrorMessageElement('fechaHora');
    addErrorMessageElement('categoria');
    addErrorMessageElement('servicio');
    
    let nombreInteracted = false;
    let emailInteracted = false;
    let fechaInteracted = false;
    let categoriaInteracted = false;
    let servicioInteracted = false;
    
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    nombreCompletoInput.addEventListener('blur', () => {
        nombreInteracted = true;
        validateNombreCompleto();
    });
    
    emailInput.addEventListener('blur', () => {
        emailInteracted = true;
        validateEmail();
    });
    
    fechaHoraInput.addEventListener('blur', () => {
        fechaInteracted = true;
        validateFechaHora();
    });
    
    categoriaSelect.addEventListener('change', () => {
        categoriaInteracted = true;
        validateCategoria();
    });
    
    servicioSelect.addEventListener('change', () => {
        servicioInteracted = true;
        validateServicio();
    });
    
    function validateNombreCompleto() {
        const value = nombreCompletoInput.value.trim();
        if (!nombreInteracted) return false;
        
        if (value === '') {
            showInvalid(nombreCompletoInput, 'El nombre es requerido');
            return false;
        } else if (!nombreRegex.test(value)) {
            showInvalid(nombreCompletoInput, 'El nombre solo puede contener letras y espacios');
            return false;
        } else if (value.length < 8) {
            showInvalid(nombreCompletoInput, 'El nombre debe tener al menos 8 caracteres');
            return false;
        } else {
            showValid(nombreCompletoInput);
            return true;
        }
    }
    
    function validateEmail() {
        const value = emailInput.value.trim();
        if (!emailInteracted) return false;
        
        if (value === '') {
            showInvalid(emailInput, 'El correo electrónico es requerido');
            return false;
        } else if (!emailRegex.test(value)) {
            showInvalid(emailInput, 'Ingresa un correo electrónico válido');
            return false;
        } else {
            showValid(emailInput);
            return true;
        }
    }
    
    function validateFechaHora() {
        if (!fechaInteracted) return false;
        
        const selectedDate = new Date(fechaHoraInput.value);
        const now = new Date();
        const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        if (!fechaHoraInput.value) {
            showInvalid(fechaHoraInput, 'La fecha y hora son requeridas');
            return false;
        } else if (selectedDate < minDate) {
            showInvalid(fechaHoraInput, 'Debes agendar con al menos 24 horas de anticipación');
            return false;
        } else {
            showValid(fechaHoraInput);
            return true;
        }
    }
    
    function validateCategoria() {
        if (!categoriaInteracted) return false;
        
        if (!categoriaSelect.value) {
            showInvalid(categoriaSelect, 'Debes seleccionar una categoría');
            return false;
        } else {
            showValid(categoriaSelect);
            return true;
        }
    }
    
    function validateServicio() {
        if (!servicioInteracted) return false;
        
        if (!servicioSelect.value) {
            showInvalid(servicioSelect, 'Debes seleccionar un servicio');
            return false;
        } else {
            showValid(servicioSelect);
            return true;
        }
    }
    
    function showInvalid(element, message) {
        element.classList.remove('valid');
        element.classList.add('invalid');
        const errorElement = document.getElementById(`${element.id}-error`);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function showValid(element) {
        element.classList.remove('invalid');
        element.classList.add('valid');
        const errorElement = document.getElementById(`${element.id}-error`);
        errorElement.style.display = 'none';
    }
    
    function addErrorMessageElement(inputId) {
        const input = document.getElementById(inputId);
        const errorElement = document.createElement('div');
        errorElement.id = `${inputId}-error`;
        errorElement.className = 'error-message';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    
    formEditarCita.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        nombreInteracted = true;
        emailInteracted = true;
        fechaInteracted = true;
        categoriaInteracted = true;
        servicioInteracted = true;
        
        const isNombreValid = validateNombreCompleto();
        const isEmailValid = validateEmail();
        const isFechaValid = validateFechaHora();
        const isCategoriaValid = validateCategoria();
        const isServicioValid = validateServicio();
        
        const isFormValid = isNombreValid && isEmailValid && isFechaValid && 
                         isCategoriaValid && isServicioValid;
        
        if (!isFormValid) {
            const alerta = document.getElementById('mensajeAlerta');
            alerta.textContent = 'Por favor corrige los errores en el formulario.';
            alerta.style.backgroundColor = '#f8d7da';
            alerta.style.color = '#721c24';
            alerta.style.display = 'block';
            return;
        }
        
        const id = document.getElementById('citaId').value;
        const nombre = document.getElementById('nombreCompleto').value;
        const email = document.getElementById('email').value;
        const fechaHora = document.getElementById('fechaHora').value;
        const categoria = document.getElementById('categoria').value;
        const servicio = document.getElementById('servicio').value;
        
        try {
            const response = await fetch(`http://localhost:4000/actualizarCita/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre,
                    email,
                    fechaHora,
                    categoria,
                    servicio
                }),
            });

            if (response.ok) {
                const alerta = document.getElementById('mensajeAlerta');
                alerta.textContent = 'Cita actualizada correctamente.';
                alerta.style.backgroundColor = '#d4edda';
                alerta.style.color = '#155724';
                alerta.style.display = 'block';
                
                setTimeout(() => {
                    alerta.style.display = 'none';
                }, 3000);
                
                obtenerCitas();
                document.getElementById('formEditarCita').reset();
                document.getElementById('formularioCita').style.display = 'none';
            } else {
                const alerta = document.getElementById('mensajeAlerta');
                alerta.textContent = 'Error al actualizar la cita.';
                alerta.style.backgroundColor = '#f8d7da';
                alerta.style.color = '#721c24';
                alerta.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al actualizar la cita:', error);
            const alerta = document.getElementById('mensajeAlerta');
            alerta.textContent = 'Hubo un problema al actualizar la cita.';
            alerta.style.backgroundColor = '#f8d7da';
            alerta.style.color = '#721c24';
            alerta.style.display = 'block';
        }
    });
}

function actualizarCategorias() {
    const categoriaSelect = document.getElementById('categoria');
    categoriaSelect.innerHTML = '<option value="" class="option-default texto-general">Seleccione una categoría</option>';
    
    const categorias = ["Hombre", "Mujer", "Niños"];
    
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        option.className = 'option-categoria texto-general';
        categoriaSelect.appendChild(option);
    });
}

function actualizarServicios() {
    const categoria = document.getElementById('categoria').value;
    const servicioSelect = document.getElementById('servicio');
    
    servicioSelect.innerHTML = '<option value="" class="option-default texto-general">Seleccione un servicio</option>';
    
    let servicios = [];
    
    if (categoria === "Hombre") {
        servicios = ["Corte de cabello", "Rasurado tradicional", "Mascarilla negra carbón activado"];
    } else if (categoria === "Mujer") {
        servicios = [
            "Corte de cabello en capas",
            "Corte recto",
            "Corte degrafilado",
            "Corte bob",
            "Depilación con hilo (cejas, rostro)",
            "Depilación con cera (axilas, piernas, brazos, rostro, bikini)",
            "Diseño de ceja",
            "Depilación con cera (ceja y bozo)",
            "Pestañas clásicas",
            "Pestañas efecto rímel",
            "Retiro de extensiones",
            "Lifting de pestañas",
            "Tinte completo",
            "Balayage",
            "Mechas 3D",
            "Babylights",
            "Peinado con ondas sueltas",
            "Recogidos para eventos",
            "Planchado exprés",
            "Peinado de novia y quinceañera",
            "Maquillaje social (de día o de noche)",
            "Maquillaje para eventos (bodas y XV años)",
            "Maquillaje con aerógrafo",
            "Maquillaje artístico o fantasía",
            "Uñas esculturales",
            "Nail art (diseños personalizados, pedrería, efecto cromo)",
            "Uñas encapsuladas",
            "Gelish",
            "Manicure tradicional",
            "Manicure spa",
            "Pedicure básico",
            "Pedicure spa (hidratación profunda)"
        ];
    } else if (categoria === "Niños") {
        servicios = [
            "Corte de cabello infantil",
            "Peinados y trenzas tematicas",
            "Manicura y pedicura infantil",
            "Maquillaje Infantil",
            "Tatuajes temporales y glitter",
            "Spa infantil"
        ];
    }
    
    servicios.forEach(servicio => {
        const option = document.createElement('option');
        option.value = servicio;
        option.textContent = servicio;
        option.className = 'option-servicio texto-general';
        servicioSelect.appendChild(option);
    });
    
    const categoriaSelect = document.getElementById('categoria');
    if (categoriaSelect.classList.contains('valid') || categoriaSelect.classList.contains('invalid')) {
        const event = new Event('change');
        servicioSelect.dispatchEvent(event);
    }
}

async function obtenerCitas() {
    try {
        const response = await fetch('http://localhost:4000/obtenerCitas', {
            method: 'GET',
        });

        const citas = await response.json();

        const cuerpoTabla = document.getElementById('cuerpoTabla');
        cuerpoTabla.innerHTML = '';

        citas.forEach(cita => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${cita.id}</td>
                <td>${cita.nombreCompleto}</td>
                <td>${cita.email}</td>
                <td data-fecha="${cita.fechaHora}">${new Date(cita.fechaHora).toLocaleString()}</td>
                <td>${cita.categoria}</td>
                <td>${cita.servicio}</td>
                <td>
                    <button class="btn-accion btn-editar">Editar</button>
                    <button class="btn-accion btn-eliminar" data-id="${cita.id}">Eliminar</button>
                </td>
            `;
            cuerpoTabla.appendChild(fila);
        });

        agregarEventosEliminar();
        agregarEventosEditar();

    } catch (error) {
        console.error('Error al obtener citas:', error);
        const alerta = document.getElementById('mensajeAlerta');
        alerta.textContent = 'Error al cargar las citas.';
        alerta.style.display = 'block';
        alerta.style.backgroundColor = '#f8d7da';
        alerta.style.color = '#721c24';
    }
}

function agregarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');

    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const idCita = e.currentTarget.getAttribute('data-id');
            
            if (!idCita || idCita === 'null') {
                console.error('ID de cita no válido');
                return;
            }
            
            mostrarModalConfirmacion(idCita);
        });
    });
}

function mostrarModalConfirmacion(id) {
    const modal = document.getElementById('modalConfirmacion');
    modal.style.display = 'flex';
    
    document.getElementById('btnConfirmarEliminar').onclick = () => {
        eliminarCita(id);
        modal.style.display = 'none';
    };
    
    document.getElementById('btnCancelarEliminar').onclick = () => {
        modal.style.display = 'none';
    };
}

function agregarEventosEditar() {
    const botonesEditar = document.querySelectorAll('.btn-editar');

    botonesEditar.forEach((boton) => {
        boton.addEventListener('click', () => {
            const fila = boton.closest('tr');
            const celdas = fila.querySelectorAll('td');

            const id = celdas[0].textContent;
            const nombre = celdas[1].textContent;
            const email = celdas[2].textContent;

            const fechaCelda = celdas[3];
            const fechaTextoISO = fechaCelda.getAttribute('data-fecha');
            const fecha = new Date(fechaTextoISO);

            if (isNaN(fecha.getTime())) {
                alert('Fecha no válida en la cita seleccionada.');
                return;
            }

            const categoria = celdas[4].textContent;
            const servicio = celdas[5].textContent;

            document.getElementById('citaId').value = id;
            document.getElementById('nombreCompleto').value = nombre;
            document.getElementById('email').value = email;
            document.getElementById('fechaHora').value = fecha.toISOString().slice(0, 16);
            
            document.getElementById('categoria').value = categoria;
            actualizarServicios();
            
            setTimeout(() => {
                document.getElementById('servicio').value = servicio;
            }, 100);

            document.getElementById('formularioCita').style.display = 'block';
            
            const formElements = document.querySelectorAll('.input-campo');
            formElements.forEach(el => {
                el.classList.remove('valid');
                el.classList.remove('invalid');
            });
            
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(el => {
                el.style.display = 'none';
            });
        });
    });
}

async function eliminarCita(id) {
    try {
        const response = await fetch(`http://localhost:4000/eliminarCita/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            const alerta = document.getElementById('mensajeAlerta');
            alerta.textContent = 'Cita eliminada exitosamente.';
            alerta.style.backgroundColor = '#d4edda';
            alerta.style.color = '#155724';
            alerta.style.display = 'block';
            
            setTimeout(() => {
                alerta.style.display = 'none';
            }, 3000);
            
            obtenerCitas();
        } else {
            const alerta = document.getElementById('mensajeAlerta');
            alerta.textContent = 'Error al eliminar la cita.';
            alerta.style.backgroundColor = '#f8d7da';
            alerta.style.color = '#721c24';
            alerta.style.display = 'block';
        }
    } catch (error) {
        console.error('Error al eliminar la cita:', error);
        const alerta = document.getElementById('mensajeAlerta');
        alerta.textContent = 'Hubo un problema al eliminar la cita.';
        alerta.style.backgroundColor = '#f8d7da';
        alerta.style.color = '#721c24';
        alerta.style.display = 'block';
    }
}

document.getElementById('btnBuscar').addEventListener('click', () => {
    buscarCitas();
});

document.getElementById('inputBuscar').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        buscarCitas();
    }
});

function buscarCitas() {
    const textoBusqueda = document.getElementById('inputBuscar').value.toLowerCase();
    const filas = document.getElementById('cuerpoTabla').querySelectorAll('tr');
    
    filas.forEach(fila => {
        const nombre = fila.cells[1].textContent.toLowerCase();
        const email = fila.cells[2].textContent.toLowerCase();
        
        if (nombre.includes(textoBusqueda) || email.includes(textoBusqueda)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}