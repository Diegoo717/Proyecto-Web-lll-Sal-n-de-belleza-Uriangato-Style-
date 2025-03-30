const express = require('express');
const path = require('path');
const { agendarCita } = require('../controllers/citaController'); 

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend-app/HTML/index.html'));
});

router.post('/agendarCita', agendarCita); 

module.exports = router;
