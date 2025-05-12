const express = require('express')
const router = express.Router()

const { crearNiño } = require('../controllers/servicios/niños/crearServNiño')
const { actualizarNiño } = require('../controllers/servicios/niños/editarNiño')
const { eliminarNiño } = require('../controllers/servicios/niños/eliminarServNiño')
const { obtenerNiñoPorId } = require('../controllers/servicios/niños/obtenerNiñoporID')
const { verServNiño } = require('../controllers/servicios/niños/verServNiño')

router.post('/niños', crearNiño);
router.get('/verServNiños', verServNiño);
router.delete('/niños/:id', eliminarNiño);
router.get('/niños/:id', obtenerNiñoPorId);
router.put('/actualizarNiño/:id', actualizarNiño);