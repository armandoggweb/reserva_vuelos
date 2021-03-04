require('./schema')
const Aeropuerto = require('../models/aeropuertos')
const aeropuertosRAW = require('./aeropuertos.json').data[1].data

const aeropuertos = aeropuertosRAW.map(aeropuerto => {
  const label = aeropuerto.label.split(', ')
  return {
    nombre: label[0],
    siglas: aeropuerto.iata,
    pais: label[2],
    ciudad: label[1]
  }
})

aeropuertos.forEach( aeropuerto =>{
  Aeropuerto.crear(aeropuerto)
})
