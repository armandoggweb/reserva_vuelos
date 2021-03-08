const cliente = require('../db/connection')

//Consulta para crear un vuelo nuevo
exports.crear = data => {
  const { a_llegada, a_salida, f_llegada, f_salida } = data
  const consulta = {
    text: `INSERT INTO vuelos (aeropuerto_llegada, aeropuerto_salida, fecha_llegada, fecha_salida) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
    values: [a_llegada, a_salida, f_llegada, f_salida]
  }

  cliente
    .query(consulta)
    .then(res => console.log('Vuelo creado con éxito'))
    .catch(err => console.error(err.stack))
}

const consulta = `select vuelos.aeropuerto_llegada, aeropuertos.id, aeropuertos.nombre 
                  from vuelos 
                  inner join aeropuertos 
                  on vuelos.aeropuerto_llegada = aeropuertos.id;`