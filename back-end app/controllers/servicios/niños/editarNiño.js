const Niño = require('../../../models/Niño');

const actualizarNiño = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            DirecImgServicio,
            NombreServicio,
            CostoServicio,
            DescripcionServicio
        } = req.body;

        const niño = await Niño.findByPk(id);

        if (!niño) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }

        niño.DirecImgServicio = DirecImgServicio;
        niño.NombreServicio = NombreServicio;
        niño.CostoServicio = CostoServicio;
        niño.DescripcionServicio = DescripcionServicio;

        await niño.save();

        res.status(200).json({ 
            mensaje: 'Servicio actualizado exitosamente', 
            data: niño 
        });
    } catch (error) {
        console.error("Error al actualizar el servicio:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { actualizarNiño };