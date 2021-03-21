const express = require('express')
const router = express.Router()

const VuelosController = require('../controllers/vuelos')
const controlador = new VuelosController

router.get('/disponibles', controlador.disponibles())

module.exports = router