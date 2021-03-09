const cliente = require('../db/connection')

//Consulta para crear un vuelo nuevo
exports.crear = data => {
  const { origen, destino, salida, llegada } = data
  const consulta = {
    text: `INSERT INTO vuelos (origen, destino, salida, llegada) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
    values: [origen, destino, salida, llegada]
  }

  cliente
    .query(consulta)
    .then(res => console.log('Vuelo creado con éxito'))
    .catch(err => console.error(err.stack))
}

exports.encontrarUno = data => {
  const { campo, valor } = data
  const consulta = {
    text: `SELECT * 
          FROM vuelos
          WHERE ${campo} = $1;
          `,
    values: [valor]
  }
  return cliente
    .query(consulta)
    .then(res => {
      if (res.rows.length > 0) {
        console.log('Vuelo econtrado con éxito')
        return res.rows[0]
      }
    })
    .catch(err => console.error(err.stack))
}

exports.encontrarVuelos = data => {
  const { origen, destino } = data
  const consulta = {
    text: `SELECT * 
          FROM vuelos
          WHERE origen = $1 and destino = $2;
          `,
    values: [origen, destino]
  }
  return cliente
    .query(consulta)
    .then(res => {
      if (res.rows.length > 0) {
        console.log('Vuelos econtrados con éxito')
        return res.rows
      }
    })
    .catch(err => console.error(err.stack))
}
