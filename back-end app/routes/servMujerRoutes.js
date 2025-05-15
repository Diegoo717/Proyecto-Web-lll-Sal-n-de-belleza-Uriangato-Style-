const express = require('express');
const router = express.Router();

const { verServMujer } = require('../controllers/servicios/mujer/verServMujer');
const { obtenerMujerPorId } = require('../controllers/servicios/mujer/obtenerMujerPorID');
const { crearMujer } = require('../controllers/servicios/mujer/crearServMujer');
const { eliminarMujer } = require('../controllers/servicios/mujer/eliminarServMujer');
const { actualizarMujer } = require('../controllers/servicios/mujer/editarMujer');

router.post('/mujeres', crearMujer);
router.get('/verServMujeres', verServMujer);
router.delete('/mujeres/:id', eliminarMujer);
router.get('/mujeres/:id', obtenerMujerPorId);
router.put('/actualizarMujer/:id', actualizarMujer);

module.exports = router;