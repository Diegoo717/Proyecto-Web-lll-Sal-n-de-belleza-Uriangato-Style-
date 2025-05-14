const  Cita  = require('../models/cita');

const eliminarCita = async (req, res) => {
    try {
        const id = req.params.id;

        const cita = await Cita.findByPk(id);

        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        await cita.destroy();

        res.status(200).json({ mensaje: 'Cita eliminada exitosamente' });
    } catch (error) {
        console.error("Error al eliminar la cita:", error);
        res.status(500).json({ error: "Error al eliminar la cita" });
    }
};

module.exports = { eliminarCita };
