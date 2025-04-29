const express = require('express');
const router = express.Router();
const { actualizarHombre } = require('../controllers/servicios/hombre/editarHombre');
const { crearHombre } = require('../controllers/servicios/hombre/crearServHombre');
const { verServHombre } = require('../controllers/servicios/hombre/verServHombre');
const { eliminarHombre } = require('../controllers/servicios/hombre/eliminarServHombre');
const { obtenerHombrePorId } = require('../controllers/servicios/hombre/obtenerHombrePorID');


router.put('/actualizarHombre/:id', actualizarHombre);
router.post('/hombres', crearHombre);
router.get('/verServHombres', verServHombre);
router.delete('/hombres/:id', eliminarHombre);
router.get('/hombres/:id', obtenerHombrePorId);

module.exports = router;