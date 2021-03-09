const express = require('express')
const router = express.Router()

const controlador = require('../controllers/vuelosController')

router.get('/disponibles', controlador.disponibles)

module.exports = router