let usernameInteracted = false;
        let emailInteracted = false;
        let datetimeInteracted = false;
        let categoryInteracted = false;
        let serviceInteracted = false;

        function updateServices() {
            const category = document.getElementById("category").value;
            const serviceSelect = document.getElementById("service");

            serviceSelect.innerHTML = "";

            let services = [];
            if (category === "hombre") {
                services = ["Corte de cabello", "Rasurado tradicional", "Mascarilla negra carbón activado"];
            } else if (category === "mujer") {
                services = [
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
            } else if (category === "niños") {
                services = [
                    "Corte de cabello infantil", 
                    "Peinados y trenzas tematicas", 
                    "Manicura y pedicura infantil", 
                    "Maquillaje Infantil", 
                    "Tatuajes temporales y glitter", 
                    "Spa infantil"
                ];
            }

            if (services.length > 0) {
                services.forEach(service => {
                    let option = document.createElement("option");
                    option.value = service.toLowerCase().replace(/\s+/g, "-"); 
                    option.textContent = service;
                    serviceSelect.appendChild(option);
                });
            } else {
                let option = document.createElement("option");
                option.value = "";
                option.textContent = "Selecciona una categoría primero";
                serviceSelect.appendChild(option);
            }
            
            if (categoryInteracted) validateCategory();
            if (serviceInteracted) validateService();
            checkFormValidity();
        }

        const form = document.getElementById('form-agendarCita');
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const datetimeInput = document.getElementById('datetime');
        const categorySelect = document.getElementById('category');
        const serviceSelect = document.getElementById('service');
        const submitBtn = document.getElementById('submit-btn');
        const confirmationModal = document.getElementById('confirmation-modal');
        const okButton = document.getElementById('ok-button');
        const appointmentDetails = document.getElementById('appointment-details');

        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function showError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        function hideError(elementId) {
            const errorElement = document.getElementById(elementId);
            errorElement.style.display = 'none';
        }

        function validateUsername() {
    const value = usernameInput.value.trim();
    if (!usernameInteracted) return false;
    
    if (value === '') {
        usernameInput.classList.remove('valid');
        usernameInput.classList.add('invalid');
        showError('username-error', 'El nombre completo es requerido');
        return false;
    } else if (!nameRegex.test(value)) {
        usernameInput.classList.remove('valid');
        usernameInput.classList.add('invalid');
        showError('username-error', 'El nombre solo puede contener letras y espacios');
        return false;
    } else {
        const words = value.split(' ').filter(word => word.length > 0);
        
        if (words.length < 2) {
            usernameInput.classList.remove('valid');
            usernameInput.classList.add('invalid');
            showError('username-error', 'Debe ingresar al menos un nombre y un apellido');
            return false;
        } else if (words.some(word => word.length < 4)) {
            usernameInput.classList.remove('valid');
            usernameInput.classList.add('invalid');
            showError('username-error', 'Debe ingresar al menos un nombre y un apellido');
            return false;
        } else {
            usernameInput.classList.remove('invalid');
            usernameInput.classList.add('valid');
            hideError('username-error');
            return true;
        }
    }
}

            function validateEmail() {
                const value = emailInput.value.trim();
                if (!emailInteracted) return false;
                
                if (value === '') {
                    emailInput.classList.remove('valid');
                    emailInput.classList.add('invalid');
                    showError('email-error', 'El correo electrónico es requerido');
                    return false;
                } else if (!emailRegex.test(value)) {
                    emailInput.classList.remove('valid');
                    emailInput.classList.add('invalid');
                    showError('email-error', 'Ingresa un correo electrónico válido');
                    return false;
                } else {
                    emailInput.classList.remove('invalid');
                    emailInput.classList.add('valid');
                    hideError('email-error');
                    return true;
                }
            }

            function validateDatetime() {
        if (!datetimeInteracted) return false;
        
        const selectedDate = new Date(datetimeInput.value);
        const now = new Date();

        if (!datetimeInput.value) {
            datetimeInput.classList.remove('valid');
            datetimeInput.classList.add('invalid');
            showError('datetime-error', 'La fecha y hora son requeridas');
            return false;
        }

        if (selectedDate.toDateString() === now.toDateString()) {
            datetimeInput.classList.remove('valid');
            datetimeInput.classList.add('invalid');
            showError('datetime-error', 'Lo sentimos, solo puedes agendar para días futuros (a partir de mañana)');
            return false;
        }

        const minutes = selectedDate.getMinutes();
        if (minutes !== 0 && minutes !== 30) {
            datetimeInput.classList.remove('valid');
            datetimeInput.classList.add('invalid');
            showError('datetime-error', 'Las citas solo se pueden agendar en horarios completos (ej: 10:00) o medios (ej: 10:30)');
            return false;
        }
        
        const dayOfWeek = selectedDate.getDay();
        const hours = selectedDate.getHours();
        
        if (dayOfWeek === 0) {
            datetimeInput.classList.remove('valid');
            datetimeInput.classList.add('invalid');
            showError('datetime-error', 'No se atiende los domingos');
            return false;
        }
        
        if (dayOfWeek >= 1 && dayOfWeek <= 5) { 
            const openingTime = 10; 
            const closingTime = 19; 
            
            if (hours < openingTime || hours >= closingTime || 
            (hours === closingTime && minutes > 0)) {
                datetimeInput.classList.remove('valid');
                datetimeInput.classList.add('invalid');
                showError('datetime-error', 'Horario de atención: Lunes a Viernes de 10:00 am a 7:00 pm');
                return false;
            }
        } else if (dayOfWeek === 6) { 
            const openingTime = 10; 
            const closingTime = 16; 
            
            if (hours < openingTime || hours >= closingTime || 
            (hours === closingTime && minutes > 0)) {
                datetimeInput.classList.remove('valid');
                datetimeInput.classList.add('invalid');
                showError('datetime-error', 'Horario de atención: Sábados de 10:00 am a 4:00 pm');
                return false;
            }
        }
        
        datetimeInput.classList.remove('invalid');
        datetimeInput.classList.add('valid');
        hideError('datetime-error');
        return true;
    }

        function validateCategory() {
            if (!categoryInteracted) return false;
            
            if (!categorySelect.value) {
                categorySelect.classList.remove('valid');
                categorySelect.classList.add('invalid');
                showError('category-error', 'Debes seleccionar una categoría');
                return false;
            } else {
                categorySelect.classList.remove('invalid');
                categorySelect.classList.add('valid');
                hideError('category-error');
                return true;
            }
        }

        function validateService() {
            if (!serviceInteracted) return false;
            
            if (!serviceSelect.value) {
                serviceSelect.classList.remove('valid');
                serviceSelect.classList.add('invalid');
                showError('service-error', 'Debes seleccionar un servicio');
                return false;
            } else {
                serviceSelect.classList.remove('invalid');
                serviceSelect.classList.add('valid');
                hideError('service-error');
                return true;
            }
        }

        function checkFormValidity() {
            const isUsernameValid = usernameInteracted ? validateUsername() : false;
            const isEmailValid = emailInteracted ? validateEmail() : false;
            const isDatetimeValid = datetimeInteracted ? validateDatetime() : false;
            const isCategoryValid = categoryInteracted ? validateCategory() : false;
            const isServiceValid = serviceInteracted ? validateService() : false;
            
            const isFormValid = isUsernameValid && 
                               isEmailValid && 
                               isDatetimeValid && 
                               isCategoryValid && 
                               isServiceValid;
            
            submitBtn.disabled = !isFormValid;
            return isFormValid;
        }

        function formatDateTime(datetimeStr) {
            const date = new Date(datetimeStr);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            
            return `${day}/${month}/${year} a las ${hours}:${minutes}`;
        }

        function showConfirmationModal(userData) {
            const serviceText = document.querySelector(`#service option[value="${userData.servicio}"]`).textContent;
            const pCorreo = document.querySelector("#p-correo")
            const em = document.querySelector("#email")
            const gmailButton = document.querySelector("#gmail-button");

            gmailButton.addEventListener("click", () => {
                window.location.href = "https://mail.google.com/";
            });

            let categoryText = "";
            if (userData.categoria === "hombre") categoryText = "Hombre";
            else if (userData.categoria === "mujer") categoryText = "Mujer";
            else if (userData.categoria === "niños") categoryText = "Niñ@s";
            
            const formattedDate = formatDateTime(userData.fechaHora);
            appointmentDetails.innerHTML = `
                <strong>Nombre:</strong> ${userData.nombreCompleto}<br>
                <strong>Fecha:</strong> ${formattedDate}<br>
                <strong>Categoría:</strong> ${categoryText}<br>
                <strong>Servicio:</strong> ${serviceText}
            `;

            pCorreo.textContent = em.value
            
            confirmationModal.style.display = "flex";
            
            form.style.display = "none";
        }

        usernameInput.addEventListener('input', () => {
            if (!usernameInteracted) usernameInteracted = true;
            validateUsername();
            checkFormValidity();
        });

        usernameInput.addEventListener('blur', () => {
            usernameInteracted = true;
            validateUsername();
            checkFormValidity();
        });

        emailInput.addEventListener('input', () => {
            if (!emailInteracted) emailInteracted = true;
            validateEmail();
            checkFormValidity();
        });

        emailInput.addEventListener('blur', () => {
            emailInteracted = true;
            validateEmail();
            checkFormValidity();
        });

        datetimeInput.addEventListener('change', () => {
            if (!datetimeInteracted) datetimeInteracted = true;
            validateDatetime();
            checkFormValidity();
        });

        datetimeInput.addEventListener('blur', () => {
            datetimeInteracted = true;
            validateDatetime();
            checkFormValidity();
        });

        categorySelect.addEventListener('change', () => {
            if (!categoryInteracted) categoryInteracted = true;
            validateCategory();
            checkFormValidity();
        });

        serviceSelect.addEventListener('change', () => {
            if (!serviceInteracted) serviceInteracted = true;
            validateService();
            checkFormValidity();
        });

        okButton.addEventListener('click', () => {
            window.location.href = 'http://localhost:4000/HTML/index.html';
        });

        form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    usernameInteracted = true;
    emailInteracted = true;
    datetimeInteracted = true;
    categoryInteracted = true;
    serviceInteracted = true;
    
    if (!checkFormValidity()) {
        return;
    }

    const nombreCompleto = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const fechaHora = datetimeInput.value;
    const categoria = categorySelect.value;
    const servicio = serviceSelect.options[serviceSelect.selectedIndex].value;

    try {
        const response = await fetch("http://localhost:4000/agendarCita", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombreCompleto, email, fechaHora, categoria, servicio })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showConfirmationModal({ nombreCompleto, email, fechaHora, categoria, servicio });
        } else {
            if (response.status === 409) {
                datetimeInput.classList.remove('valid');
                datetimeInput.classList.add('invalid');
                showError('datetime-error', data.error);
            } else {
                alert("Error: " + data.error);
            }
        }
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        alert("Hubo un problema al agendar la cita");
    }
});