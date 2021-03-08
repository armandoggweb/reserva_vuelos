require('./schema')
const Aeropuerto = require('../models/aeropuertos')
const Vuelo = require('../models/vuelos')
const aeropuertosRAW = require('./aeropuertos.json').data[1].data

// aeropuertosRAW.map(aeropuerto => {
//   const label = aeropuerto.label.split(', ')
//   return {
//     nombre: label[0],
//     siglas: aeropuerto.iata,
//     pais: label[2],
//     ciudad: label[1]
//   }
// }).
//   forEach(aeropuerto => {
//     Aeropuerto.crear(aeropuerto)
//   })

Aeropuerto.encontrarTodos()
  .then(aeropuertos => {
    aeropuertos.forEach(() => {
      let indice1 = Math.floor(Math.random() * 14)
      let indice2 = (() => {
        let numero = 0
        do {
          numero = Math.floor(Math.random() * 14)
        } while (indice1 == numero)
        return numero
      })()
      let f_salida = fechaAleatoria(new Date(), new Date(2021, 12, 31))
      let f_llegada = fechaAleatoria(f_salida, new Date(2021, 12, 31))
      Vuelo.crear({
        a_llegada: aeropuertos[indice1].id,
        a_salida: aeropuertos[indice2].id,
        f_llegada: f_llegada,
        f_salida: f_salida,
      })
    })
  })
  function fechaAleatoria(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

