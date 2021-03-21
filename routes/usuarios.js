const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../passport')

const UsuariosControlador = require('../controllers/usuarios')
const controlador = new UsuariosControlador

//Rutas disponibles para el controlador Usuario

//Crear usuario
router.get('/crear', controlador.crear_get())

router.post('/crear', controlador.crear_post())

//Sesión del usuario
router.get('/login', controlador.login_get())

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  successFlash: true,
  badRequestMessage: 'Email o contraseña inválidos',
  failureRedirect: '/usuario/login',
  failureFlash: true
}))

router.get('/logout', controlador.logout())

//Modificar usuario
router.get('/editar/:id', controlador.editar_get())

router.post('/editar/:id', controlador.editar_post())

//Eliminar usaurio
router.get('/eliminar/:id', controlador.eliminar_get())

router.post('/eliminar/:id', controlador.eliminar_post())

//Perfil del usuario
router.get('/:id', controlador.perfil())

module.exports = router;