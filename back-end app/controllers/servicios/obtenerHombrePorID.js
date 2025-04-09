const Hombre = require('../../models/Hombre');

const obtenerHombrePorId = async (req, res) => {
    try {
        const id = req.params.id;
        const hombre = await Hombre.findByPk(id);

        if (!hombre) {
            return res.status(404).json({ 
                success: false,
                error: 'Servicio no encontrado' 
            });
        }

        res.status(200).json({ 
            success: true,
            data: hombre 
        });
    } catch (error) {
        console.error("Error al obtener el servicio:", error);
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor" 
        });
    }
};


module.exports = { obtenerHombrePorId };