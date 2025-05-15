const Admin = require('../../models/admin');
const bcrypt = require('bcrypt');
require('dotenv').config();

const crearAdminController = {
    crearAdmin: async (req, res) => {
        try {
            const { usuario, contraseña } = req.body;

            if (!usuario || !contraseña) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Usuario y contraseña son requeridos' 
                });
            }

            const adminExistente = await Admin.findOne({ where: { usuario } });

            if (adminExistente) {
                return res.status(400).json({ 
                    success: false,
                    message: 'El usuario ya existe' 
                });
            }

            const saltRounds = 10;
            const contraseñaHasheada = await bcrypt.hash(contraseña, saltRounds);

            const nuevoAdmin = await Admin.create({
                usuario,
                contraseña: contraseñaHasheada
            });

            res.status(201).json({
                success: true,
                message: 'Administrador creado exitosamente',
                data: {
                    id: nuevoAdmin.id,
                    usuario: nuevoAdmin.usuario
                }
            });

        } catch (error) {
            console.error('Error al crear admin:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error en el servidor' 
            });
        }
    }
}


module.exports = crearAdminController;