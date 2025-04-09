const Hombre = require('../../models/Hombre');

const actualizarHombre = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            DirecImgServicio,
            NombreServicio,
            CostoServicio,
            DescripcionServicio
        } = req.body;

        const hombre = await Hombre.findByPk(id);

        if (!hombre) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }

        // Actualizar campos
        hombre.DirecImgServicio = DirecImgServicio;
        hombre.NombreServicio = NombreServicio;
        hombre.CostoServicio = CostoServicio;
        hombre.DescripcionServicio = DescripcionServicio;

        await hombre.save();

        res.status(200).json({ 
            mensaje: 'Servicio actualizado exitosamente', 
            data: hombre 
        });
    } catch (error) {
        console.error("Error al actualizar el servicio:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { actualizarHombre };