const express = require('express');
const router = express.Router();

const { verServMujer } = require('../controllers/servicios/mujer/verServMujer');
const { obtenerMujerPorId } = require('../controllers/servicios/mujer/obtenerMujerPorID');

router.get('/mujeres/:id', obtenerMujerPorId);
router.get('/verServMujeres', verServMujer);

module.exports = router;