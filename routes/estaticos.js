const express = require('express')
const router = express.Router()

const controlador = require('../controllers/vuelosController')

router.get('/', controlador.busqueda)
router.get('/info', function(req, res){
  res.render('info', {title: 'Información'})
})
router.get('/contacto', function(req, res){
  res.render('contacto', {title: 'Contacto'})
})

module.exports = router