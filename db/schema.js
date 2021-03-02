const cliente = require('../db/connection')

const crearUsuarios = (() => {
  const consulta = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id SMALLSERIAL PRIMARY KEY,
      dni CHAR(9) UNIQUE NOT NULL,
      email VARCHAR(30) UNIQUE NOT NULL,
      nombre VARCHAR(20) NOT NULL,
      apellidos VARCHAR(20) NOT NULL,
      edad SMALLINT NOT NULL
    )
  `
  cliente
    .query(consulta)
    .then(res => console.log('Tabla usuarios creada con éxito'))
    .catch(err => console.error(err.stack))
})()
