const Niño = require('../../../models/Niño');

const obtenerNiñoPorId = async (req, res) => {
    try {
        const id = req.params.id;
        const niño = await Niño.findByPk(id);

        if (!niño) {
            return res.status(404).json({ 
                success: false,
                error: 'Servicio no encontrado' 
            });
        }

        res.status(200).json({ 
            success: true,
            data: niño 
        });
    } catch (error) {
        console.error("Error al obtener el servicio:", error);
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor" 
        });
    }
};


module.exports = { obtenerNiñoPorId };