const Niño = require('../../../models/Niño');

const verServNiño = async (req, res) => {
    try {
        const servicios = await Niño.findAll({
            order: [['id', 'ASC']] 
        });
        
        if (!servicios || servicios.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No hay servicios para niños registrados en este momento',
                data: []
            });
        }

        const serviciosFormateados = servicios.map(servicio => ({
            id: servicio.id,
            DirecImgServicio: servicio.DirecImgServicio.startsWith('/')
                ? servicio.DirecImgServicio
                : `/img/servicios/${servicio.DirecImgServicio}`,
            NombreServicio: servicio.NombreServicio,
            CostoServicio: parseFloat(servicio.CostoServicio), 
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
        console.error('Error al obtener servicios para niños:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor al obtener servicios',
            details: error.message
        });
    }
};

module.exports = { verServNiño };