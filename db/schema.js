const cliente = require('../db/connection')

const crearUsuarios = (() => {
  const consulta = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id SMALLSERIAL PRIMARY KEY,
      dni CHAR(9) UNIQUE NOT NULL,
      email VARCHAR(30) UNIQUE NOT NULL,
      nombre VARCHAR(20) NOT NULL,
      apellidos VARCHAR(30) NOT NULL,
      edad SMALLINT NOT NULL
    )
  `
  cliente
    .query(consulta)
    .then(res => console.log('Tabla usuarios creada con éxito'))
    .catch(err => console.error(err.stack))
})()

const crearAeropuertos = (() => {
  const consulta = `
    CREATE TABLE IF NOT EXISTS aeropuertos (
      id SMALLSERIAL PRIMARY KEY,
      nombre VARCHAR(40) UNIQUE NOT NULL,
      siglas CHAR(3) UNIQUE NOT NULL,
      pais VARCHAR(20) NOT NULL,
      ciudad VARCHAR(30) NOT NULL
    )
  `
  cliente
    .query(consulta)
    .then(res => console.log('Tabla aeropuertos creada con éxito'))
    .catch(err => console.error(err.stack))
})()

const crearVuelos = (() => {
  const consulta = `
      CREATE TABLE IF NOT EXISTS vuelos (
        id SMALLSERIAL PRIMARY KEY,
        origen SMALLINT NOT NULL REFERENCES aeropuertos,
        destino SMALLINT NOT NULL REFERENCES aeropuertos,
        salida TIMESTAMP NOT NULL,
        llegada TIMESTAMP NOT NULL
      )
    `
  cliente
    .query(consulta)
    .then(res => console.log('Tabla vuelos creada con éxito'))
    .catch(err => console.error(err.stack))
})()

const crearReservas = (() => {
  const consulta = `
      CREATE TABLE IF NOT EXISTS reservas (
        id SMALLSERIAL PRIMARY KEY,
        vuelo_id SMALLINT NOT NULL REFERENCES vuelos,
        usuario_id SMALLINT NOT NULL REFERENCES usuarios
      )
    `
  cliente
    .query(consulta)
    .then(res => console.log('Tabla reservas creada con éxito'))
    .catch(err => console.error(err.stack))
})()
