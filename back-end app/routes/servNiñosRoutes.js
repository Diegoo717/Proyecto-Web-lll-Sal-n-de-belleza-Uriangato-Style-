const express = require('express')
const router = express.Router()

const { crearNiño } = require('../controllers/servicios/niños/crearServNiño')
const { actualizarNiño } = require('../controllers/servicios/niños/editarNiño')
const { eliminarNiño } = require('../controllers/servicios/niños/eliminarServNiño')
const { obtenerNiñoPorId } = require('../controllers/servicios/niños/obtenerNiñoporID')
const { verServNiño } = require('../controllers/servicios/niños/verServNiño')

router.post('/ninos', crearNiño);
router.get('/verServNinos', verServNiño);
router.delete('/ninos/:id', eliminarNiño);
router.get('/ninos/:id', obtenerNiñoPorId);
router.put('/actualizarNino/:id', actualizarNiño);

module.exports = router;