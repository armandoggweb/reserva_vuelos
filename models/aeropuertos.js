const cliente = require('../db/connection')

//Consulta para crear un usuario nuevo
exports.crear = data => {
  const { nombre, siglas, pais, ciudad } = data
  const consulta = {
    text: `INSERT INTO aeropuertos (nombre, siglas, pais, ciudad) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
    values: [nombre, siglas, pais, ciudad ]
  }

  cliente
    .query(consulta)
    .then(res => console.log('Aeropuerto creado con éxito'))
    .catch(err => console.error(err.stack))
}