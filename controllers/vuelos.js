const AeropuertoModelo = require('../models/aeropuerto')
const Aeropuerto = new AeropuertoModelo

const VueloModelo = require('../models/vuelo')
const Vuelo = new VueloModelo

const ReservaModelo = require('../models/reserva')
const Reserva = new ReservaModelo

//Para buscar vuelos se comprobará previamente
//si el usuario ha iniciado sesión

module.exports = class VuelosController {

  //Formulario de búsqueda de vuelos
  busqueda() {
    return function (req, res, next) {
      Aeropuerto.encontrarTodos()
        .then(result => {
          res.render('inicio', { title: 'Bienvenidos', aeropuertos: result, mensaje_exito: req.flash('success') })
        })
        .catch(err => console.error(err.stack))
    }
  }

  //Muestra los vuelos disponibles
  disponibles() {
    return [
      function (req, res, next) {
        if (!req.user) {
          res.redirect('/')
        }
        next()
      }
      , function (req, res, next) {
        Promise.all([
          Aeropuerto.encontrarTodos(),
          Vuelo.encontrarVuelos({ origen: req.query.origen, destino: req.query.destino }),
          Reserva.encontrarUno({ campo: 'id', valor: req.query.reserva })
        ])
          .then(result => {
            if (!result[1]) {
              res.render('inicio', { title: 'Bievenidos', aeropuertos: result[0], errors: 'No hay vuelos disponibles en a ruta seleccionada' })
              return
            } else {
              if (!result[0]) {
                res.redirect('/')
              } else {
                const vuelos = result[1].map(vuelo => vuelo)
                const aeropuertos = {
                  origen: result[0].filter(aeropuerto => aeropuerto.id == req.query.origen)[0],
                  destino: result[0].filter(aeropuerto => aeropuerto.id == req.query.destino)[0]
                }
                const action = req.query.reserva ? '/reservas/editar/' + req.query.reserva : '/reservas/crear'
                res.render('vuelos/disponibles', { title: ' Vuelos disponibles', vuelos, aeropuertos, action, reserva: result[2] })
              }
            }
          })
          .catch(err => console.error(err.stack))
      }
    ]
  }
}

