const express = require('express')
const router = express.Router()

const VuelosController = require('../controllers/vuelos')
const controlador = new VuelosController

//Formulario de busqueda de vuelso en la página de inicio
router.get('/', controlador.busqueda())

//Página de información
router.get('/info', function(req, res){
  res.render('info', {title: 'Información'})
})

//Página de contacto
router.get('/contacto', function(req, res){
  res.render('contacto', {title: 'Contacto'})
})

module.exports = router