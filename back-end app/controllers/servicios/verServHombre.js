const Hombre = require('../../models/Hombre');

const verServHombre = async (req, res) => {
    try {
        // Obtener todos los servicios ordenados por ID
        const servicios = await Hombre.findAll({
            order: [['id', 'ASC']] // Orden ascendente por ID
        });
        
        if (!servicios || servicios.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No hay servicios para hombres registrados en este momento',
                data: []
            });
        }
        
        // Formatear los datos de imagen para rutas locales y asegurar que CostoServicio sea número
        const serviciosFormateados = servicios.map(servicio => ({
            id: servicio.id,
            DirecImgServicio: servicio.DirecImgServicio.startsWith('/')
                ? servicio.DirecImgServicio
                : `/img/servicios/${servicio.DirecImgServicio}`,
            NombreServicio: servicio.NombreServicio,
            CostoServicio: parseFloat(servicio.CostoServicio), // Aseguramos que sea número
            DescripcionServicio: servicio.DescripcionServicio,
            createdAt: servicio.createdAt,
            updatedAt: servicio.updatedAt
        }));
        
        res.status(200).json({
            success: true,
            count: servicios.length,
            data: serviciosFormateados
        });
        
    } catch (error) {
        console.error('Error al obtener servicios para hombres:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor al obtener servicios',
            details: error.message
        });
    }
};

module.exports = { verServHombre };