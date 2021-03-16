const Usuario = require('../models/usuario')
const Reserva = require('../models/reserva')
const Aeropuerto = require('../models/aeropuerto')

const { validationResult } = require("express-validator")
const { validacionUsuario } = require('./helper');

const bcrypt = require('bcryptjs')
const passport = require('passport')
require('../passport')

//Formulario para crear usuario
exports.crear_get = function (req, res, next) {
  res.render('usuario/form', {
    title: 'Crear usuario',
    usuario: undefined,
    action: '/usuario/crear',
    errors: null
  });
};

//Envío de formulario para crear usuario
exports.crear_post = [
  //Sanitazación y validación de datos
  validacionUsuario(),

  function (req, res, err) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('usuario/form', {
        title: 'Crear usuario',
        usuario: req.body,
        action: '/usuario/crear',
        errors: errors.array()
      })
      return
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        const data = {
          dni: req.body.dni,
          email: req.body.email,
          nombre: req.body.nombre,
          apellidos: req.body.apellidos,
          edad: req.body.edad,
          password: hashedPassword
        }
  
        //Consulta para crear registro
        Usuario.crear(data)
      })      

      res.redirect('/')
    }
  }
]

//Formulario paraeditar usuario
exports.editar_get = function (req, res, next) {
  Usuario.encontrarUno({
    campo: 'id',
    valor: req.params.id
  })
    .then(result => {
      if (result) {
        res.render('usuario/form', {
          title: 'Editar usuario',
          usuario: result,
          action: '/usuario/editar/' + req.params.id,
          errors: null
        })
      } else {
        res.redirect('/')
      }
    })
    .catch(err => {
      console.error(err)
    })
}

//Actualizar datos de usuario existente
exports.editar_post = [
  //Validación de datos
  validacionUsuario()
  ,

  function (req, res, err) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.render('usuario/form', {
        title: 'Editar usuario',
        usuario: req.body,
        action: '/usuario/editar/' + req.params.id,
        errors: errors.array()
      })
      return
    } else {
      const data = {
        id: req.params.id,
        dni: req.body.dni,
        email: req.body.email,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        edad: req.body.edad
      }
      //Consulta para actualizar campos
      Usuario.actualizar(data)

      res.redirect('/usuario/' + req.params.id)
    }
  }
]

//Muestra confirmación para eliminar usuario
exports.eliminar_get = function (req, res, next) {
  Usuario.encontrarUno({
    campo: 'id',
    valor: req.params.id
  })
    .then(result => {
      if (result) {
        res.render('usuario/eliminar', {
          title: 'Eliminar usuario',
          usuario: result,
          errors: null
        })
      } else {
        res.redirect('/')
      }
    })
    .catch(err => {
      console.error(err)
    })
}

//Borra el usuario
exports.eliminar_post = function (req, res, next) {
  Usuario.eliminar(req.params.id)
    .then(resultado => res.redirect('/'))
    .catch(err => console.error(err.stack))
}

//Muestra el perfil del usuario
exports.perfil = function (req, res, next) {
  if(req.user){
    Promise.all([
      Aeropuerto.encontrarTodos(),
      Reserva.encontrarTodasUsuario(req.params.id)
    ])
      .then(result => {
        if (result[0]) {
          res.render('usuario/perfil', {
            title: 'Perfil',
            aeropuertos: result[0],
            reservas: result[1],
            errors: null
          })
          return
        }
        res.redirect('/')
      })
  }else{
    res.redirect('/usuario/login')
  }
}

exports.login_get = function (req, res, next) {
  res.render('usuario/login', { title: 'Iniciar sesión' })
}

exports.login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/usuario/login'
})

exports.logout = function(req, res){
  req.logout()
  res.redirect('/')
}