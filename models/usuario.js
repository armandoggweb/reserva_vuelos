const cliente = require('../db/connection')

//Consulta para crear un usuario nuevo
exports.crear = data => {
  const { dni, email, nombre, apellidos, edad, password } = data
  const consulta = {
    text: `INSERT INTO usuarios (dni, email, nombre, apellidos, edad, password) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
    values: [dni, email, nombre, apellidos, edad, password]
  }

  cliente
    .query(consulta)
    .then(res => {
      console.log('Usuario creado con éxito')
      return res.rows[0]
    })
    .catch(err => console.error(err.stack))
}

//Consulta para actualizar los datos de un usuario existente
exports.actualizar = data => {
  const { dni, email, nombre, apellidos, edad, id } = data
  const consulta = {
    text: ` UPDATE usuarios 
            SET dni = ($1), email = ($2), nombre = ($3), apellidos = ($4), edad = ($5)
            WHERE id = ($6)
          `,
    values: [dni, email, nombre, apellidos, edad, id]
  }

  cliente
    .query(consulta)
    .then(res => {
      if (!res.rowCount > 0) {
        console.log('No se ha podido modificar el usuario')
      } else {
        console.log('Usuario modificado con éxito')
      }
    })
    .catch(err => console.error(err.stack))
}

exports.eliminar = id => {
  const consulta = {
    text: 'DELETE FROM usuarios WHERE id = $1',
    values: [id],
  }
  return cliente
    .query(consulta)
    .then(res => {
      if (!res.rowCount > 0) {
        console.log('No se ha podido eliminar el usuario')
      } else {
        console.log('Usuario eliminado con éxito')
      }
    })
    .catch(err => console.log(err.stack))
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
      console.log(`Se han encontrado un usuario exitosamente`)
      if (res.rows.length > 0) return res.rows[0]
    })
    .catch(err => console.log(err.stack))
}
