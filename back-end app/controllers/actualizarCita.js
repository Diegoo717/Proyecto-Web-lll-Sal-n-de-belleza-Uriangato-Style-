const  Cita  = require('../models/cita');

const actualizarCita = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            nombre,
            email,
            fechaHora,
            categoria,
            servicio
        } = req.body;

        const cita = await Cita.findByPk(id);

        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        cita.nombreCompleto = nombre;
        cita.email = email;
        cita.fechaHora = fechaHora;
        cita.categoria = categoria;
        cita.servicio = servicio;

        await cita.save();

        res.status(200).json({ mensaje: 'Cita actualizada exitosamente', cita });
    } catch (error) {
        console.error("Error al actualizar la cita:", error);
        res.status(500).json({ error: "Error al actualizar la cita" });
    }
};

module.exports = { actualizarCita };
