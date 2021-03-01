const consultar = require('./db.js')
console.log(consultar)

const crearTabla = (() => {
  const consulta = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      dni CHAR(9),
      email VARCHAR(30),
      nombre VARCHAR(20),
      apellidos VARCHAR(20),
      edad SMALLINT
    )
  `
  consultar(consulta, 'Tabla creada con éxito')
})()
