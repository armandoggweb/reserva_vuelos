const { Client } = require('pg')

require('dotenv').config()

const cliente = new Client({
  connectionString: process.env.DATABASE_URL,
});

cliente.connect((err => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log('Conexión a la base de datos realizada con éxito')
  }
}))

module.exports = cliente