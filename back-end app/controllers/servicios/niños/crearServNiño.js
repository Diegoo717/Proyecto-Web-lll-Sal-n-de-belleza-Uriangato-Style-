const Niño = require('../../../models/Niño');

const crearNiño = async (req, res) => {
    try {
        const { 
            DirecImgServicio, 
            NombreServicio, 
            CostoServicio, 
            DescripcionServicio 
        } = req.body;

        if (!DirecImgServicio || !NombreServicio || !CostoServicio || !DescripcionServicio) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const costoNumerico = parseFloat(CostoServicio);
        if (isNaN(costoNumerico)) {
            return res.status(400).json({ error: 'El costo debe ser un valor numérico' });
        }

        const nuevoNiño = await Niño.create({
            DirecImgServicio,
            NombreServicio,
            CostoServicio: costoNumerico, 
            DescripcionServicio
        });

        res.status(201).json({
            mensaje: 'Servicio creado exitosamente',
            data: nuevoNiño
        });

    } catch (error) {
        console.error("Error al crear servicio:", error);
        res.status(500).json({ 
            error: "Error interno del servidor",
            detalles: error.message 
        });
    }
};

module.exports = { crearNiño };