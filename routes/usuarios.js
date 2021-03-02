const express = require('express')
const router = express.Router()

const controlador = require('../controllers/usuariosController')
router.get('/crear', controlador.crear_usuario_get)

router.post('/crear', controlador.crear_usuario_post)

router.get('/:id', controlador.perfil_usuario)

module.exports = router;