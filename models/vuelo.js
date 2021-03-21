const cliente = require('../db/connection')
const Modelo = require('./modelo')
module.exports = class VueloModelo extends Modelo{
  constructor(){
    super()
    this.tabla = 'vuelos'
  }
  //Consulta para insertar un vuelo en la base de datos
  crear(data){
    const { origen, destino, salida, llegada } = data
    const consulta = {
      text: `INSERT INTO ${this.tabla} (origen, destino, salida, llegada) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
      values: [origen, destino, salida, llegada]
    }

    cliente
      .query(consulta)
      .then(res => console.log('Vuelo creado con éxito'))
      .catch(err => console.error(err.stack))
  }

  encontrarVuelos(data){
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
}
