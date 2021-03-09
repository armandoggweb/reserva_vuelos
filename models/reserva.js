const cliente = require('../db/connection')

exports.crear = data => {
  const { usuario, vuelo } = data
  const consulta = {
    text: `INSERT INTO reservas (usuario_id, vuelo_id) 
            VALUES ($1, $2) 
            `,
    values: [usuario, vuelo]
  }

  cliente
    .query(consulta)
    .then(res => console.log('Reservas creada con éxito'))
    .catch(err => console.error(err.stack))
}

//Consulta para actualizar los datos de un usuario existente
exports.actualizar = data => {
  const { usuario, vuelo, id } = data
  const consulta = {
    text: ` UPDATE reservas 
            SET usuario_id = $1, vuelo_id = $2
            WHERE id = $3;
          `,
    values: [usuario, vuelo, id]
  }

  cliente
    .query(consulta)
    .then(res => {
      if (!res.rowCount > 0) {
        console.log('No se ha podido modificar la reserva')
      } else {
        console.log('Reserva modificada con éxito')
      }
    })
    .catch(err => console.error(err.stack))
}

exports.eliminar = id => {
  const consulta = {
    text: 'DELETE FROM reservas WHERE id = $1',
    values: [id]
  }
  return cliente
    .query(consulta)
    .then(res => {
      if (!res.rowCount > 0) {
        console.log('No se ha podido eliminar la reserva')
      } else {
        console.log('Reserva eliminada con éxito')
      }
    })
    .catch(err => console.log(err.stack))
}

exports.encontrarTodasUsuario = (usuario) => {
  const consulta = {
    text: `SELECT r.id, r.vuelo_id, v.origen, v.destino, v.salida, v.llegada 
          FROM reservas r 
          INNER JOIN vuelos v 
          ON r.vuelo_id = v.id 
          WHERE r.usuario_id = $1;`,
    values: [usuario]
  }
  return cliente
    .query(consulta)
    .then(res => {
      console.log(`Se ha ejecutado exitosamente`)
      if (res.rows.length > 0) return res.rows
    })
    .catch(err => console.log(err.stack))
}

exports.encontrarUno = (data) => {
  const { campo, valor } = data
  const consulta = {
    text: `SELECT *
          FROM reservas 
          WHERE ${campo} = $1;`,
    values: [valor]
  }
  return cliente
    .query(consulta)
    .then(res => {
      console.log(`Se ha ejecutado exitosamente`)
      if (res.rows.length > 0) return res.rows[0]
    })
    .catch(err => console.log(err.stack))
}