const cliente = require('../db/connection')

const Modelo = require('./modelo')

module.exports = class UsuarioModelo extends Modelo {
  constructor() {
    super()
    this.tabla = 'usuarios'
  }

  //Consulta para crear un usuario nuevo
  crear(data) {
    const { dni, email, nombre, apellidos, edad, password } = data
    const consulta = {
      text: `INSERT INTO ${this.tabla} (dni, email, nombre, apellidos, edad, password) 
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
  actualizar(data) {
    const { dni, email, nombre, apellidos, edad, id } = data
    const consulta = {
      text: ` UPDATE ${this.tabla} 
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

}
