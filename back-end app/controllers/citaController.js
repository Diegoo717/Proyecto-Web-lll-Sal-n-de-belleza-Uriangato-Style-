const { Cita } = require('../models');

const agendarCita = async (req, res) => {
    try {
        const { nombreCompleto, email, fechaHora, categoria, servicio } = req.body;

        const fechaHoraUTC = new Date(fechaHora).toISOString();

        if (!nombreCompleto || !email || !fechaHora || !categoria || !servicio) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const nuevaCita = await Cita.create({ nombreCompleto, email, fechaHora, categoria, servicio });

        res.status(201).json({ message: "Cita agendada correctamente", cita: nuevaCita });
    } catch (error) {
        console.error("Error al agendar la cita:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

module.exports = { agendarCita };
