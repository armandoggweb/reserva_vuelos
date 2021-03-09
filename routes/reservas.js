const express = require('express')
const router = express.Router()

const controlador = require('../controllers/reservasController')

router.get('/crear', controlador.crear_get)
router.post('/crear', controlador.crear_post)
router.get('/editar/:id', controlador.editar)
router.post('/editar/:id', controlador.actualizar)
router.get('/eliminar/:id', controlador.eliminar_get)
router.post('/eliminar/:id', controlador.eliminar_post)

module.exports = router