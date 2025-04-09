const Hombre = require('../../models/Hombre');

const eliminarHombre = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el servicio existe
        const servicio = await Hombre.findByPk(id);
        if (!servicio) {
            return res.status(404).json({
                success: false,
                error: 'Servicio no encontrado'
            });
        }

        // Eliminar el servicio
        await servicio.destroy();

        res.status(200).json({
            success: true,
            message: 'Servicio eliminado exitosamente',
            deletedId: id
        });

    } catch (error) {
        console.error('Error al eliminar servicio:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

module.exports = { eliminarHombre };