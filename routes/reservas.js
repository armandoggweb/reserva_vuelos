const express = require('express')
const router = express.Router()

const ReservasControlador = require('../controllers/reservas')
const controlador = new ReservasControlador

//Crear reserva
router.get('/crear', controlador.crear_get())
router.post('/crear', controlador.crear_post())

//Editar reserva
router.get('/editar/:id', controlador.editar())
router.post('/editar/:id', controlador.actualizar())

//Eliminar reserva
router.get('/eliminar/:id', controlador.eliminar_get())
router.post('/eliminar/:id', controlador.eliminar_post())

module.exports = router