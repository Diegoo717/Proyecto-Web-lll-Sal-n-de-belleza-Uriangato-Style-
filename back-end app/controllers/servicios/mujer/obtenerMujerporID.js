const Mujer = require('../../../models/Mujer');

const obtenerMujerPorId = async (req, res) => {
    try {
        const id = req.params.id;
        const mujer = await Mujer.findByPk(id);

        if (!mujer) {
            return res.status(404).json({ 
                success: false,
                error: 'Servicio no encontrado' 
            });
        }

        res.status(200).json({ 
            success: true,
            data: mujer 
        });
    } catch (error) {
        console.error("Error al obtener el servicio:", error);
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor" 
        });
    }
};


module.exports = { obtenerMujerPorId };