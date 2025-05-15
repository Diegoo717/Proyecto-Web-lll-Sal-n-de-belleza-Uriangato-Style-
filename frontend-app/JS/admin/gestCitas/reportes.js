document.addEventListener('DOMContentLoaded', () => {
    document.body.style.visibility = 'hidden';
    verificarYMostrar();
    
    // Configurar fechas por defecto (últimos 30 días)
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 30);
    
    document.getElementById('fechaInicio').valueAsDate = fechaInicio;
    document.getElementById('fechaFin').valueAsDate = fechaFin;
    
    // Asegurar que los contenedores de los gráficos tengan altura fija
    configurarContenedoresGraficos();
    
    // Cargar datos iniciales
    cargarDatosReportes();
    
    // Configurar eventos
    document.getElementById('btnAplicarFiltros').addEventListener('click', cargarDatosReportes);
    document.getElementById('btnResetFiltros').addEventListener('click', resetearFiltros);
    document.getElementById('btnExportarPDF').addEventListener('click', exportarPDF);
    document.getElementById('btnExportarExcel').addEventListener('click', exportarExcel);
    document.getElementById('btnImprimir').addEventListener('click', imprimirReporte);
});

function configurarContenedoresGraficos() {
    // Establecer alturas fijas para los contenedores de los gráficos
    const contenedores = document.querySelectorAll('.chart-container');
    contenedores.forEach(contenedor => {
        contenedor.style.height = '300px';
        contenedor.style.maxHeight = '300px';
        contenedor.style.position = 'relative';
    });
    
    // El contenedor de servicios necesita más altura por ser un gráfico horizontal
    const contenedorServicios = document.getElementById('graficoServicios').parentNode;
    if (contenedorServicios) {
        contenedorServicios.style.height = '400px';
        contenedorServicios.style.maxHeight = '400px';
    }
}

async function verificarYMostrar() {
    try {
        await verificarToken();
        document.body.style.visibility = 'visible';
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

function cargarDatosReportes() {
    try {
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const categoria = document.getElementById('categoriaFiltro').value;
        
        // Asegurar que los contenedores de gráficos mantengan su altura adecuada
        configurarContenedoresGraficos();
        
        // Simular la respuesta si hay problemas con el servidor
        fetchCitas(fechaInicio, fechaFin, categoria)
            .then(citas => {
                // Aplicar filtros
                citas = filtrarCitas(citas, fechaInicio, fechaFin, categoria);
                
                // Actualizar resumen estadístico
                actualizarResumenEstadistico(citas);
                
                // Generar gráficos
                generarGraficos(citas);
                
                // Generar tabla de resumen
                generarTablaResumen(citas);
            })
            .catch(error => {
                console.error('Error al obtener citas:', error);
                alert('Error al cargar los datos para los reportes');
            });
    } catch (error) {
        console.error('Error al cargar datos de reportes:', error);
        alert('Error al cargar los datos para los reportes');
    }
}

async function fetchCitas(fechaInicio, fechaFin, categoria) {
    try {
        const response = await fetch('http://localhost:4000/obtenerCitas', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Error al obtener citas');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener citas del servidor:', error);
        
        // Retornar datos de muestra si el servidor no responde
        return generarDatosMuestra();
    }
}

function generarDatosMuestra() {
    // Datos de muestra para probar la visualización
    const categorias = ['Hombre', 'Mujer', 'Niños'];
    const servicios = [
        'Corte de cabello', 'Tinte', 'Peinado', 'Manicure', 
        'Pedicure', 'Tratamiento facial', 'Corte de barba', 
        'Alisado', 'Depilación', 'Maquillaje'
    ];
    
    const citas = [];
    const fechaActual = new Date();
    
    // Generar 100 citas de muestra en los últimos 90 días
    for (let i = 0; i < 100; i++) {
        const diasAtras = Math.floor(Math.random() * 90);
        const fechaCita = new Date(fechaActual);
        fechaCita.setDate(fechaCita.getDate() - diasAtras);
        
        // Establecer hora aleatoria entre 9 AM y 7 PM
        fechaCita.setHours(9 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);
        
        citas.push({
            id: i + 1,
            cliente: `Cliente ${i + 1}`,
            categoria: categorias[Math.floor(Math.random() * categorias.length)],
            servicio: servicios[Math.floor(Math.random() * servicios.length)],
            fechaHora: fechaCita.toISOString(),
            estado: Math.random() > 0.2 ? 'Completada' : 'Cancelada'
        });
    }
    
    return citas;
}

function filtrarCitas(citas, fechaInicio, fechaFin, categoria) {
    return citas.filter(cita => {
        const fechaCita = new Date(cita.fechaHora);
        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = new Date(fechaFin);
        
        // Ajustar fechaFin para incluir todo el día
        fechaFinObj.setHours(23, 59, 59, 999);
        
        // Filtrar por fecha
        if (fechaCita < fechaInicioObj || fechaCita > fechaFinObj) {
            return false;
        }
        
        // Filtrar por categoría si se especificó (ignorando mayúsculas/minúsculas)
        if (categoria && categoria !== '') {
            // Convertir ambos valores a minúsculas para comparar de forma no sensible a mayúsculas
            return cita.categoria.toLowerCase() === categoria.toLowerCase();
        }
        
        return true;
    });
}

function actualizarResumenEstadistico(citas) {
    // Total de citas
    document.getElementById('totalCitas').textContent = citas.length;
    
    // Citas hoy
    const hoy = new Date().toISOString().split('T')[0];
    const citasHoy = citas.filter(cita => {
        return cita.fechaHora.split('T')[0] === hoy;
    }).length;
    document.getElementById('citasHoy').textContent = citasHoy;
    
    // Categoría más popular
    const categoriasCount = {};
    citas.forEach(cita => {
        categoriasCount[cita.categoria] = (categoriasCount[cita.categoria] || 0) + 1;
    });
    
    let categoriaPopular = '-';
    let maxCategoria = 0;
    for (const [categoria, count] of Object.entries(categoriasCount)) {
        if (count > maxCategoria) {
            maxCategoria = count;
            categoriaPopular = categoria;
        }
    }
    document.getElementById('categoriaPopular').textContent = categoriaPopular;
    
    // Servicio más popular
    const serviciosCount = {};
    citas.forEach(cita => {
        serviciosCount[cita.servicio] = (serviciosCount[cita.servicio] || 0) + 1;
    });
    
    let servicioPopular = '-';
    let maxServicio = 0;
    for (const [servicio, count] of Object.entries(serviciosCount)) {
        if (count > maxServicio) {
            maxServicio = count;
            servicioPopular = servicio;
        }
    }
    document.getElementById('servicioPopular').textContent = servicioPopular;
}

function generarGraficos(citas) {
    // Gráfico de citas por categoría
    generarGraficoCategorias(citas);
    
    // Gráfico de citas por mes
    generarGraficoMensual(citas);
    
    // Gráfico de servicios más populares
    generarGraficoServicios(citas);
    
    // Gráfico de distribución por día de la semana
    generarGraficoDiasSemana(citas);
    
    // Gráfico de horarios más solicitados
    generarGraficoHorarios(citas);
}

function generarGraficoCategorias(citas) {
    const ctx = document.getElementById('graficoCategorias').getContext('2d');
    
    // Obtener categorías únicas dinámicamente desde los datos
    const categoriasUnicas = [...new Set(citas.map(cita => cita.categoria))];
    
    // Contar citas por categoría
    const datos = categoriasUnicas.map(cat => {
        return citas.filter(cita => cita.categoria === cat).length;
    });
    
    // Verificar si hay datos
    console.log('Categorías encontradas:', categoriasUnicas);
    console.log('Datos para gráfico de categorías:', datos);
    
    // Si todos los valores son cero, agregar un valor mínimo para que el gráfico se muestre
    const todosCero = datos.every(valor => valor === 0);
    if (todosCero) {
        console.log('Todos los datos son cero, se añadirá un valor mínimo para visualizar el gráfico');
        datos[0] = 0.1; // Añadir un valor mínimo para que Chart.js pueda renderizar
    }
    
    // Colores para las categorías (asegurarse de tener suficientes colores)
    const coloresBase = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];
    // Generar más colores si hay más categorías que colores
    const colores = categoriasUnicas.map((_, index) => 
        coloresBase[index % coloresBase.length]
    );
    
    // Destruir gráfico anterior si existe
    if (window.graficoCategorias instanceof Chart) {
        window.graficoCategorias.destroy();
    }
    
    // Restablecer el canvas para evitar problemas de renderizado
    const contenedor = document.getElementById('graficoCategorias').parentNode;
    contenedor.innerHTML = '<canvas id="graficoCategorias"></canvas>';
    const nuevoCtx = document.getElementById('graficoCategorias').getContext('2d');
    
    // Establecer altura máxima
    contenedor.style.height = '300px';
    
    // Crear el nuevo gráfico con un pequeño retraso para asegurar que el DOM está listo
    setTimeout(() => {
        window.graficoCategorias = new Chart(nuevoCtx, {
            type: 'doughnut',
            data: {
                labels: categoriasUnicas,
                datasets: [{
                    data: datos,
                    backgroundColor: colores,
                    hoverBackgroundColor: colores.map(c => `${c}dd`),
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',  // Asegurar que se renderice como doughnut
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
        console.log('Gráfico de categorías generado:', window.graficoCategorias);
    }, 100);
}

function generarGraficoMensual(citas) {
    const ctx = document.getElementById('graficoMensual').getContext('2d');
    
    // Agrupar citas por mes
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const citasPorMes = Array(12).fill(0);
    
    citas.forEach(cita => {
        const fecha = new Date(cita.fechaHora);
        const mes = fecha.getMonth();
        citasPorMes[mes]++;
    });
    
    // Destruir gráfico anterior si existe
    if (window.graficoMensual instanceof Chart) {
        window.graficoMensual.destroy();
    }
    
    // Establecer altura máxima
    document.getElementById('graficoMensual').parentNode.style.height = '300px';
    
    window.graficoMensual = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: "Citas",
                backgroundColor: "#4e73df",
                hoverBackgroundColor: "#2e59d9",
                borderColor: "#4e73df",
                data: citasPorMes,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function generarGraficoServicios(citas) {
    const ctx = document.getElementById('graficoServicios').getContext('2d');
    
    // Contar servicios más populares (top 10)
    const serviciosCount = {};
    citas.forEach(cita => {
        serviciosCount[cita.servicio] = (serviciosCount[cita.servicio] || 0) + 1;
    });
    
    const serviciosOrdenados = Object.entries(serviciosCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    const labels = serviciosOrdenados.map(s => s[0]);
    const data = serviciosOrdenados.map(s => s[1]);
    
    // Destruir gráfico anterior si existe
    if (window.graficoServicios instanceof Chart) {
        window.graficoServicios.destroy();
    }
    
    // Establecer altura máxima
    document.getElementById('graficoServicios').parentNode.style.height = '400px';
    
    // Usar bar con indexAxis: 'y' en vez de horizontalBar (esto es para Chart.js v3)
    window.graficoServicios = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: "Citas",
                backgroundColor: "#1cc88a",
                hoverBackgroundColor: "#17a673",
                borderColor: "#1cc88a",
                data: data,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',  // Esto hace que sea horizontal (Chart.js v3)
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function generarGraficoDiasSemana(citas) {
    const ctx = document.getElementById('graficoDiasSemana').getContext('2d');
    
    // Agrupar citas por día de la semana
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const citasPorDia = Array(7).fill(0);
    
    citas.forEach(cita => {
        const fecha = new Date(cita.fechaHora);
        const dia = fecha.getDay(); // 0 (Domingo) a 6 (Sábado)
        citasPorDia[dia]++;
    });
    
    // Destruir gráfico anterior si existe
    if (window.graficoDiasSemana instanceof Chart) {
        window.graficoDiasSemana.destroy();
    }
    
    // Establecer altura máxima
    document.getElementById('graficoDiasSemana').parentNode.style.height = '300px';
    
    window.graficoDiasSemana = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: dias,
            datasets: [{
                data: citasPorDia,
                backgroundColor: [
                    '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', 
                    '#e74a3b', '#858796', '#5a5c69'
                ],
                hoverBackgroundColor: [
                    '#4e73dfdd', '#1cc88add', '#36b9ccdd', '#f6c23edd',
                    '#e74a3bdd', '#858796dd', '#5a5c69dd'
                ],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

function generarGraficoHorarios(citas) {
    const ctx = document.getElementById('graficoHorarios').getContext('2d');
    
    // Agrupar citas por hora del día
    const horas = Array(24).fill(0).map((_, i) => `${i}:00`);
    const citasPorHora = Array(24).fill(0);
    
    citas.forEach(cita => {
        const fecha = new Date(cita.fechaHora);
        const hora = fecha.getHours();
        citasPorHora[hora]++;
    });
    
    // Destruir gráfico anterior si existe
    if (window.graficoHorarios instanceof Chart) {
        window.graficoHorarios.destroy();
    }
    
    // Establecer altura máxima
    document.getElementById('graficoHorarios').parentNode.style.height = '300px';
    
    window.graficoHorarios = new Chart(ctx, {
        type: 'line',
        data: {
            labels: horas,
            datasets: [{
                label: "Citas",
                tension: 0.3,  // En Chart.js v3 es 'tension' en lugar de 'lineTension'
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: citasPorHora,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function generarTablaResumen(citas) {
    const cuerpoTabla = document.getElementById('cuerpoTablaResumen');
    cuerpoTabla.innerHTML = '';
    
    // Agrupar por categoría y servicio
    const resumen = {};
    
    citas.forEach(cita => {
        if (!resumen[cita.categoria]) {
            resumen[cita.categoria] = {};
        }
        
        if (!resumen[cita.categoria][cita.servicio]) {
            resumen[cita.categoria][cita.servicio] = 0;
        }
        
        resumen[cita.categoria][cita.servicio]++;
    });
    
    // Llenar la tabla
    for (const [categoria, servicios] of Object.entries(resumen)) {
        for (const [servicio, cantidad] of Object.entries(servicios)) {
            const fila = document.createElement('tr');
            
            // Calcular ingresos estimados (ejemplo: $20 por servicio)
            const ingresosEstimados = cantidad * 20;
            
            fila.innerHTML = `
                <td>${categoria}</td>
                <td>${servicio}</td>
                <td>${cantidad}</td>
                <td>$${ingresosEstimados.toLocaleString()}</td>
            `;
            
            cuerpoTabla.appendChild(fila);
        }
    }
}

function resetearFiltros() {
    // Restablecer a últimos 30 días
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 30);
    
    document.getElementById('fechaInicio').valueAsDate = fechaInicio;
    document.getElementById('fechaFin').valueAsDate = fechaFin;
    document.getElementById('categoriaFiltro').value = '';
    
    // Recargar datos
    cargarDatosReportes();
}

function exportarPDF() {
    alert('Función de exportar a PDF se implementará con una librería como jsPDF');
    // Implementación real usaría jsPDF o similar
}

function exportarExcel() {
    alert('Función de exportar a Excel se implementará con una librería como SheetJS');
    // Implementación real usaría SheetJS o similar
}

function imprimirReporte() {
    window.print();
}

function redirigirALogin() {
    window.location.href = 'http://localhost:4000/HTML/loginAdministracion.html';
}