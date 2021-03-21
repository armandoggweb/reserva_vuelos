const cliente = require('../db/connection')
const Modelo = require('./modelo')

module.exports = class AeropuertoModelo extends Modelo{
  constructor(){
    super()
    this.tabla = 'aeropuertos'
  }
  //Consulta para insertar un aeropuerto enla base de datos
  crear(data) {
    const { nombre, siglas, pais, ciudad } = data
    const consulta = {
      text: `INSERT INTO ${this.tabla} (nombre, siglas, pais, ciudad) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
      values: [nombre, siglas, pais, ciudad]
    }

    cliente
      .query(consulta)
      .then(res => console.log('Aeropuerto creado con éxito'))
      .catch(err => console.error(err.stack))
  }

}