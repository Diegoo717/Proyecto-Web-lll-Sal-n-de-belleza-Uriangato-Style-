const { Cita } = require('../models');

const agendarCita = async (req, res) => {
    try {
        const { nombreCompleto, email, fechaHora, categoria, servicio } = req.body;

        if (!nombreCompleto || !email || !fechaHora || !categoria || !servicio) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const citaExistente = await Cita.findOne({ 
            where: { 
                fechaHora: new Date(fechaHora).toISOString() 
            } 
        });

        if (citaExistente) {
            return res.status(409).json({ 
                error: "Ya existe una cita agendada para este horario. Por favor, elige otra hora." 
            });
        }

        const nuevaCita = await Cita.create({ 
            nombreCompleto, 
            email, 
            fechaHora: new Date(fechaHora).toISOString(), 
            categoria, 
            servicio 
        });

        res.status(201).json({ 
            message: "Cita agendada correctamente", 
            cita: nuevaCita 
        });
    } catch (error) {
        console.error("Error al agendar la cita:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

module.exports = { agendarCita };
