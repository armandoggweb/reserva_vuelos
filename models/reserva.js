const cliente = require('../db/connection')
const Modelo = require('./modelo')

module.exports = class AeropuertoModelo extends Modelo {
  constructor() {
    super()
    this.tabla = 'reservas'
  }

  crear(data) {
    const { usuario, vuelo } = data
    const consulta = {
      text: `INSERT INTO ${this.tabla} (usuario_id, vuelo_id) 
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
  actualizar(data) {
    const { usuario, vuelo, id } = data
    const consulta = {
      text: ` UPDATE ${this.tabla} 
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

  encontrarTodasUsuario(usuario) {
    const consulta = {
      text: `SELECT r.id, r.vuelo_id, v.origen, v.destino, v.salida, v.llegada 
          FROM ${this.tabla} r 
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

}