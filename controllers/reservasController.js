const Aeropuerto = require('../models/aeropuerto')
const Vuelo = require('../models/vuelo')
const Usuario = require('../models/usuario')
const Reserva = require('../models/reserva')

exports.crear_get = function (req, res, next) {
  if (!req.query.vuelo) {
    res.redirect('back')
  } else {
    Promise.all([
      Aeropuerto.encontrarUno({ campo: 'id', valor: req.query.origen }),
      Aeropuerto.encontrarUno({ campo: 'id', valor: req.query.destino }),
      Vuelo.encontrarUno({ campo: 'id', valor: req.query.vuelo })
    ])
      .then(result => {
        res.render('reservas/form', {
          title: 'Confirmar reserva',
          vuelo: result[2],
          aeropuertos: { origen: result[0], destino: result[1] },
          action: '/reservas/crear/'
        })
      })
      .catch(err => console.error(err.stack))
  }
}

exports.crear_post = function (req, res, next) {
  Promise.all([
    Vuelo.encontrarUno({ campo: 'id', valor: req.body.vuelo }),
    Usuario.encontrarUno({ campo: 'id', valor: req.user.id })
  ])
    .then(result => {
      if (result[0] && result[1]) {
        Reserva.crear({ usuario: req.user.id, vuelo: req.body.vuelo })
        res.redirect('/usuario/' + req.user.id)
      } else {
        res.redirect('/')
      }
    })
    .catch(err => console.error(err.stack))
}


exports.editar = function (req, res, next) {
  if (!req.query.vuelo) {
    res.redirect('back')
  } else {
    Promise.all([
      Aeropuerto.encontrarUno({ campo: 'id', valor: req.query.origen }),
      Aeropuerto.encontrarUno({ campo: 'id', valor: req.query.destino }),
      Vuelo.encontrarUno({ campo: 'id', valor: req.query.vuelo })
    ])
      .then(result => {
        const reserva = req.query.reserva
        res.render('reservas/form', {
          title: 'Modificar reserva',
          vuelo: result[2],
          aeropuertos: { origen: result[0], destino: result[1] },
          action: '/reservas/editar/' + reserva,
          reserva
        })
      })
      .catch(err => console.error(err.stack))
  }
}

//Actualizar datos de usuario existente
exports.actualizar = function (req, res, err) {
  Promise.all([
    Reserva.encontrarUno({ campo: 'id', valor: req.params.id }),
  ])
    .then(result => {
      if (result) {
        Reserva.actualizar({ usuario: req.user.id, vuelo: req.body.vuelo, id: req.params.id })
        res.redirect('/usuario/' + req.user.id)
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
          errors: null
        })
      } else {
        res.redirect('/')
      }
    })
    .catch(err => {
      console.error(err)
    })
}

//Borra el usuario
exports.eliminar_post = function (req, res, next) {
  Reserva.eliminar(req.params.id)
    .then(resultado => res.redirect('/'))
    .catch(err => console.error(err.stack))
}

