const Aeropuerto = require('../models/aeropuerto')
const Vuelo = require('../models/vuelo')

exports.busqueda = function (req, res, next) {
  Aeropuerto.encontrarTodos()
    .then(result => {
        const aeropuertos = result.map(aeropuerto => {
          return {
            id: aeropuerto.id,
            ciudad: aeropuerto.ciudad
          }
        })
        res.render('inicio', { title: 'Bienvenidos', aeropuertos })
    })
}
exports.disponibles = function (req, res, next) {
  Promise.all([
    Aeropuerto.encontrarTodos(),
    Vuelo.encontrarVuelos({ origen: req.query.origen, destino: req.query.destino })
  ])
    .then(result => {
      if (!result.every(r => r)) {
        res.redirect('/')
      } else {
        const vuelos = result[1].map(vuelo => vuelo)
        const aeropuertos = {
          origen: result[0].filter(aeropuerto => aeropuerto.id == req.query.origen)[0],
          destino: result[0].filter(aeropuerto => aeropuerto.id == req.query.destino)[0]
        }
        const action = req.query.reserva ? '/reservas/editar/' + req.query.reserva : '/reservas/crear'
        res.render('vuelos/disponibles', { title: ' Vuelos disponibles', vuelos, aeropuertos, action, reserva: req.query.reserva })
      }
    })
    .catch(err => console.error(err.stack))
}