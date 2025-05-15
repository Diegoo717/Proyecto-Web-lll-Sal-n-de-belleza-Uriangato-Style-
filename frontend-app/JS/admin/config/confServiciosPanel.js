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

function redirigirALogin() {
    window.location.href = 'http://localhost:4000/HTML/loginAdministracion.html';
}

function configurarEventos() {
    document.getElementById("serv-hombre").addEventListener("click", function() {
            window.location.href = "http://localhost:4000/HTML/adminServHombre.html";
        });

        document.getElementById("serv-mujer").addEventListener("click", function() {
            window.location.href = "http://localhost:4000/HTML/adminServMujer.html";
        });

        document.getElementById("serv-ninos").addEventListener("click", function() {
            window.location.href = "http://localhost:4000/HTML/adminServNinos.html";
        });

        document.getElementById("btnRegresar").addEventListener("click", function() {
            window.location.href = "http://localhost:4000/HTML/administracion.html";
        });
}
