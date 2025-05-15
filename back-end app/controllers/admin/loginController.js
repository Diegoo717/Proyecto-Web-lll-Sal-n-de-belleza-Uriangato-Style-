const Admin = require('../../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginController = {
    login: async (req, res) => {
        try {
            const { usuario, contraseña } = req.body;

            if (!usuario || !contraseña) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Usuario y contraseña son requeridos' 
                });
            }

            const admin = await Admin.findOne({ where: { usuario } });

            if (!admin) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Credenciales inválidas' 
                });
            }

            const contraseñaValida = await bcrypt.compare(contraseña, admin.contraseña);

            if (!contraseñaValida) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Credenciales inválidas' 
                });
            }

            const token = jwt.sign(
                { id: admin.id, usuario: admin.usuario },
                process.env.JWT_SECRET,
                { expiresIn: '30min' }
            );

            res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                token
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error en el servidor' 
            });
        }
    }
}


module.exports = loginController;