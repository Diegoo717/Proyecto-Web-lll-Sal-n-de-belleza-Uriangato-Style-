const  Cita  = require('../models/cita');

const obtenerCitas = async (req, res) => {
    try {
        const citas = await Cita.findAll();
        res.status(200).json(citas);
    } catch (error) {
        console.error("Error al obtener las citas:", error);
        res.status(500).json({ error: "Error al obtener las citas" });
    }
};

module.exports = { obtenerCitas };