document.addEventListener('DOMContentLoaded', () => {
    document.body.style.visibility = 'hidden';
    verificarYMostrar();
});

async function verificarYMostrar() {
    try {
        await verificarToken();

        document.body.style.visibility = 'visible';

        configurarEventos();
        
    } catch (error) {
        console.error('Error de autenticación:', error);
        redirigirALogin();
    }
}

async function verificarToken() {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        throw new Error('No hay token');
    }

    const response = await fetch('http://localhost:4000/admin/verify-token', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Token inválido');
    }
    
    return await response.json();
}

function configurarEventos() {
    document.getElementById('logout-btn').addEventListener('click', cerrarSesion);

    const article8 = document.querySelector("#art-div-section-1-admin");
    const article9 = document.querySelector("#art-div-section-2-admin");

    article8.addEventListener("click", () => {
        window.location.href = "/HTML/gestionarCitas.html";
    });
    
    article9.addEventListener("click", () => {
        window.location.href = "/HTML/confServicios.html";
    });
}

function cerrarSesion() {
    localStorage.removeItem('adminToken');
    redirigirALogin();
}

function redirigirALogin() {
    window.location.href = 'http://localhost:4000/HTML/loginAdministracion.html';
}