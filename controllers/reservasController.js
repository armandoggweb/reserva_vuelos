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

exports.crear_post = [
  function (req, res, next) {
    if (!req.user) {
      res.redirect('/usuario/login')
    }
    next()
  }
  , function (req, res, next) {
    Promise.all([
      Vuelo.encontrarUno({ campo: 'id', valor: req.body.vuelo }),
      Usuario.encontrarUno({ campo: 'id', valor: req.user.id })
    ])
      .then(result => {
        if (result[0] && result[1]) {
          Reserva.crear({ usuario: req.user.id, vuelo: req.body.vuelo })
          req.flash('mensaje_exito', 'Reserva realizada con éxito')
          res.redirect('/usuario/' + req.user.id)
        } else {
          res.redirect('/')
        }
      })
      .catch(err => console.error(err.stack))
  }]


exports.editar = function (req, res, next) {
  if (!req.user || !req.query.vuelo) {
    res.redirect('back')
  } else {
    Promise.all([
      Aeropuerto.encontrarUno({ campo: 'id', valor: req.query.origen }),
      Aeropuerto.encontrarUno({ campo: 'id', valor: req.query.destino }),
      Vuelo.encontrarUno({ campo: 'id', valor: req.query.vuelo })
    ])
      .then(result => {
        if (result.every(r => r)) {
          res.render('reservas/form', {
            title: 'Modificar reserva',
            vuelo: result[2],
            aeropuertos: { origen: result[0], destino: result[1] },
            action: '/reservas/editar/' + req.query.reserva,
            reserva: req.query.reserva
          })
        } else {
          res.redirect('/')
        }
      })
      .catch(err => console.error(err.stack))
  }
}

//Actualizar datos de usuario existente
exports.actualizar = [
  function (req, res, next) {
    if (!req.user) {
      res.redirect('/usuario/login')
    }
    next()
  }
  , function (req, res, err) {
    Reserva.encontrarUno({ campo: 'id', valor: req.params.id })
      .then(result => {
        if (result.usuario_id == req.user.id) {
          Reserva.actualizar({ usuario: req.user.id, vuelo: req.body.vuelo, id: req.params.id })
          req.flash('mensaje_exito', 'Reserva modificada con éxito')
          res.redirect('/usuario/' + req.user.id)
        } else {
          res.redirect('/')
        }
      })
      .catch(err => console.error(err.stack))
  }]

//Muestra confirmación para eliminar usuario
exports.eliminar_get = [
  function (req, res, next) {
    if (!req.user) {
      res.redirect('/usuario/login')
    }
    next()
  }
  , function (req, res, next) {
    Reserva.encontrarUno({
      campo: 'id',
      valor: req.params.id
    })
      .then(result => {
        if (result.usuario_id == req.user.id) {
          res.render('reservas/eliminar', {
            title: 'Eliminar reserva',
            usuario_id: req.user.id,
            errors: null
          })
        } else {
          res.redirect('/')
        }
      })
      .catch(err => {
        console.error(err)
      })
  }]

//Borra el usuario
exports.eliminar_post = function (req, res, next) {
  if (!req.user) {
    res.redirect('/usuario/login')
  } else {
    if (req.user.id == req.body.usuario_id) {
      Reserva.eliminar(req.params.id)
        .then(resultado => {
          req.flash('mensaje_exito', 'Reserva eliminada con éxito')
          res.redirect('/usuario/' + req.user.id)
          return
        })
        .catch(err => console.error(err.stack))
    } else {
      res.redirect('/')
    }
  }
}

