const express = require('express')
const router = express.Router()

const controlador = require('../controllers/vuelosController')

router.get('/', controlador.busqueda)

module.exports = router