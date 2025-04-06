const express = require('express');
const path = require('path');
const { agendarCita } = require('../controllers/citaController'); 
const { obtenerCitas } = require('../controllers/obtenerCitas'); 
const { eliminarCita } = require('../controllers/eliminarCita');
const { actualizarCita } = require('../controllers/actualizarCita');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend-app/HTML/index.html'));
});

router.post('/agendarCita', agendarCita); 
router.get('/obtenerCitas', obtenerCitas);
router.delete('/eliminarCita/:id', eliminarCita);
router.put('/actualizarCita/:id', actualizarCita);

module.exports = router;
