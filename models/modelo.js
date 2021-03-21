const cliente = require('../db/connection')

module.exports = class Modelo {
  constructor() {
    this.tabla = 'tabla'
  }

  //Consulta para encontrar un registro apartir de un campo y su valor
  encontrarUno(data) {
    const { campo, valor } = data
    const consulta = {
      text: `SELECT * 
          FROM ${this.tabla}
          WHERE ${campo} = $1;
          `,
      values: [valor]
    }
    return cliente
      .query(consulta)
      .then(res => {
        if (res.rows.length > 0) {
          console.log('Registro econtrado con éxito')
          return res.rows[0]
        }else{
          console.log('No se ha encontrado ningún registro')
        }
      })
      .catch(err => console.error(err.stack))
  }

  //Consulta para encontrar todos los aeropuertos
  encontrarTodos() {
    return cliente
      .query(`SELECT * FROM ${this.tabla}`)
      .then(res => {
        if (res.rows.length > 0) {
          console.log('Se han encontrado exitosamente')
          return res.rows
        } else {
          console.log('No se ha encontrado ningún registro')
        }
      })
      .catch(err => console.log(err.stack))
  }

  eliminar(id) {
    const consulta = {
      text: `DELETE FROM ${this.tabla} WHERE id = $1`,
      values: [id]
    }
    return cliente
      .query(consulta)
      .then(res => {
        if (!res.rowCount > 0) {
          console.log('No se ha podido eliminar el registro')
        } else {
          console.log('Registro eliminado con éxito')
        }
      })
      .catch(err => console.log(err.stack))
  }
}