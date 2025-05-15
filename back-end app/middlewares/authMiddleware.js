const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = {
    verifyToken: (req, res, next) => {
        const token = req.headers['authorization'];
        
        if (!token) {
            return res.status(403).json({ 
                success: false,
                message: 'Token no proporcionado' 
            });
        }

        try {
            const tokenValue = token.split(' ')[1];

            const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

            req.admin = {
                id: decoded.id,
                usuario: decoded.usuario
            };
            
            next();
        } catch (error) {
            console.error('Error en verificación de token:', error);
            
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false,
                    message: 'Token expirado' 
                });
            }
            
            return res.status(401).json({ 
                success: false,
                message: 'Token inválido' 
            });
        }
    },

    checkRole: (role) => {
        return (req, res, next) => {
            if (req.admin.role !== role) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Acceso no autorizado para este rol' 
                });
            }
            next();
        };
    }
};

module.exports = authMiddleware;