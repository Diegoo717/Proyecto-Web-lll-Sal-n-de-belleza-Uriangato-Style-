const express = require('express');
const path = require('path');
const { agendarCita } = require('../controllers/citaController'); 
const { obtenerCitas } = require('../controllers/obtenerCitas'); 
const { eliminarCita } = require('../controllers/eliminarCita');
const { actualizarCita } = require('../controllers/actualizarCita');
const { actualizarHombre } = require('../controllers/servicios/editarHombre');
const { crearHombre } = require('../controllers/servicios/crearServHombre');
const { verServHombre } = require('../controllers/servicios/verServHombre');
const { eliminarHombre } = require('../controllers/servicios/eliminarServHombre');
const { obtenerHombrePorId } = require('../controllers/servicios/obtenerHombrePorID');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend-app/HTML/index.html'));
});

router.post('/agendarCita', agendarCita); 
router.get('/obtenerCitas', obtenerCitas);
router.delete('/eliminarCita/:id', eliminarCita);
router.put('/actualizarCita/:id', actualizarCita);

//Mis apis para servicios de hombre
router.put('/actualizarHombre/:id', actualizarHombre);
router.post('/hombres', crearHombre);
router.get('/verServHombres', verServHombre);
router.delete('/hombres/:id', eliminarHombre);
router.get('/hombres/:id', obtenerHombrePorId);

module.exports = router;
