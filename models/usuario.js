const cliente = require('../db/connection')

exports.crear = data => {
  const { dni, email, nombre, apellidos, edad } = data
  const consulta = {
    text: `INSERT INTO usuarios (dni, email, nombre, apellidos, edad) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
    values: [dni, email, nombre, apellidos, edad]
  }
  
  cliente
    .query(consulta)
    .then(res => console.log('Usuario creado con éxito'))
    .catch(err => console.error(err.stack))
}

exports.encontrarUno = data => {
  const { campo, valor } = data
  const consulta = {
    text: `SELECT * FROM usuarios WHERE ${campo} = $1`,
    values: [valor],
  }
  return cliente
    .query(consulta)
    .then(res => {
      console.log(`Se han encontrado un usuario con ${campo} igual a ${valor}`)
      if (res.rows.length > 0) return true
    })
    .catch(err => console.log(err.stack))
}
