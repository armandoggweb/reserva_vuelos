require('./schema')

const AeropuertoModelo = require('../models/aeropuerto')
const Aeropuerto = new AeropuertoModelo

const VueloModelo = require('../models/vuelo')
const Vuelo = new VueloModelo

// const aeropuertosRAW = require('./aeropuertos.json').data[1].data

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
    for(let i = 0; i < 500; i++){
      let indice1 = Math.floor(Math.random() * 14)
      let indice2 = (() => {
        let numero = 0
        do {
          numero = Math.floor(Math.random() * 14)
        } while (indice1 == numero)
        return numero
      })()
      let salida = fechaAleatoria(new Date(), new Date(2021, 12, 31))
      let llegada = fechaAleatoria(salida, new Date(2021, 12, 31))
      Vuelo.crear({
        origen: aeropuertos[indice1].id,
        destino: aeropuertos[indice2].id,
        salida,
        llegada,
      })
    }
  })

function fechaAleatoria(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

