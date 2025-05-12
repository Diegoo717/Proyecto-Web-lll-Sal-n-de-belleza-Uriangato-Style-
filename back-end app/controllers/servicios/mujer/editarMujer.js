const Mujer = require('../../../models/Mujer');

const actualizarMujer = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            DirecImgServicio,
            NombreServicio,
            CostoServicio,
            DescripcionServicio
        } = req.body;

        const mujer = await Mujer.findByPk(id);

        if (!mujer) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }

        mujer.DirecImgServicio = DirecImgServicio;
        mujer.NombreServicio = NombreServicio;
        mujer.CostoServicio = CostoServicio;
        mujer.DescripcionServicio = DescripcionServicio;

        await mujer.save();

        res.status(200).json({ 
            mensaje: 'Servicio actualizado exitosamente', 
            data: hombre 
        });
    } catch (error) {
        console.error("Error al actualizar el servicio:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { actualizarMujer };