const Aeropuerto = require('../models/aeropuerto')
const Vuelo = require('../models/vuelo')
const Usuario = require('../models/usuario')
const Reserva = require('../models/reserva')

exports.crear_get = function (req, res, next) {
  Promise.all([
    Aeropuerto.encontrarUno({ campo: 'id', valor: req.query.origen }),
    Aeropuerto.encontrarUno({ campo: 'id', valor: req.query.destino }),
    Vuelo.encontrarUno({ campo: 'id', valor: req.query.vuelo })
  ])
    .then(result => {
      res.render('reservas/form', {
        vuelo: result[2],
        aeropuertos: { origen: result[0], destino: result[1] },
        action: '/reservas/crear/'
      })
    })
    .catch(err => console.error(err.stack))
}

exports.crear_post = function (req, res, next) {
  Promise.all([
    Vuelo.encontrarUno({ campo: 'id', valor: req.body.vuelo }),
    Usuario.encontrarUno({ campo: 'id', valor: 14 })
  ])
    .then(result => {
      // console.log(result)
      if (result[0] && result[1]) {
        Reserva.crear({ usuario: 14, vuelo: req.body.vuelo })
        res.redirect('/usuario/' + '14')
      } else {
        res.redirect('/')
      }
    })
    .catch(err => console.error(err.stack))
}


exports.editar = function (req, res, next) {
  Promise.all([
    Aeropuerto.encontrarUno({ campo: 'id', valor: req.query.origen }),
    Aeropuerto.encontrarUno({ campo: 'id', valor: req.query.destino }),
    Vuelo.encontrarUno({ campo: 'id', valor: req.query.vuelo })
  ])
    .then(result => {
      const reserva = req.query.reserva
      res.render('reservas/form', {
        vuelo: result[2],
        aeropuertos: { origen: result[0], destino: result[1] },
        action: '/reservas/editar/' + reserva,
        reserva
      })
    })
    .catch(err => console.error(err.stack))
}
//Actualizar datos de usuario existente
exports.actualizar = function (req, res, err) {
  Promise.all([
    Reserva.encontrarUno({ campo: 'id', valor: req.params.id }),
  ])
    .then(result => {
      if (result) {
        Reserva.actualizar({ usuario: 14, vuelo: req.body.vuelo, id: req.params.id })
        res.redirect('/usuario/' + '14')
      } else {
        res.redirect('/')
      }
    })
    .catch(err => console.error(err.stack))
}



//Muestra confirmación para eliminar usuario
exports.eliminar_get = function (req, res, next) {
  Reserva.encontrarUno({
    campo: 'id',
    valor: req.params.id
  })
    .then(result => {
      if (result) {
        res.render('reservas/eliminar', {
          title: 'Eliminar reserva',
          usuario: result,
          errors: null
        })
      } else {
        res.redirect('/')
      }
    })
    .catch(err => {
      console.log(err)
    })
}

//Borra el usuario
exports.eliminar_post = function (req, res, next) {
  Reserva.eliminar(req.params.id)
    .then(resultado => res.redirect('/'))
    .catch(err => console.error(err.stack))
}

