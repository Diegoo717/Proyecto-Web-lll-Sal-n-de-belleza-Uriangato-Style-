const express = require('express');
const path = require('path');
const { crearAdmin } = require('../controllers/admin/crearAdminController'); 
const { login } = require('../controllers/admin/loginController');
const authMiddleware= require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/crearAdmin', crearAdmin); 
router.post('/login', login);

router.get('/verify-token', authMiddleware.verifyToken, (req, res) => {
    res.json({ 
        success: true,
        message: 'Token válido',
        admin: req.admin 
    });
});

module.exports = router;