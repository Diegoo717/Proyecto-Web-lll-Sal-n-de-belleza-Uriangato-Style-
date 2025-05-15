document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('username').value;
    const contraseña = document.getElementById('password').value;

    if (!usuario || !contraseña) {
        alert('Por favor ingrese usuario y contraseña');
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario,
                contraseña
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en el inicio de sesión');
        }

        localStorage.setItem('adminToken', data.token);

        window.location.href = 'http://localhost:4000/HTML/administracion.html';
        
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Error al iniciar sesión. Por favor intente nuevamente.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        window.location.href = 'http://localhost:4000/HTML/administracion.html';
    }
});