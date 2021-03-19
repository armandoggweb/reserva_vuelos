const Usuario = require('../models/usuario')
const Reserva = require('../models/reserva')
const Aeropuerto = require('../models/aeropuerto')

const { validationResult } = require("express-validator")
const { validacionUsuario } = require('./helper');

const bcrypt = require('bcryptjs')
const passport = require('passport');
require('../passport')

//Formulario para crear usuario
exports.crear_get = function (req, res, next) {
  res.render('usuario/form', {
    title: 'Crear usuario',
    action: '/usuario/crear',
    usuarioCampos: undefined
  });
};

//Envío de formulario para crear usuario
exports.crear_post = [
  //Sanitazación y validación de datos
  validacionUsuario(),

  function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash('mensaje_error', 'Se han producido los siguientes errores:')
      res.render('usuario/form', {
        title: 'Crear usuario',
        usuarioCampos: req.body,
        action: '/usuario/crear',
        errors: errors.array(),
        mensaje_error: req.flash('mensaje_error')
      })
      return
    } else {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10)
      const data = {
        dni: req.body.dni,
        email: req.body.email,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        edad: req.body.edad,
        password: hashedPassword
      }

      Promise.all([
        Usuario.crear(data),
        Usuario.encontrarUno({ campo: 'email', valor: req.body.email })
      ]).then(user => {
        passport.authenticate('local', (err, user) => {
          req.logIn(user, (errLogIn) => {
            if (errLogIn) {
              return next(errLogIn);
            }
            req.flash('mensaje_exito', `Bienvenido ${user.nombre}`)
            return res.redirect('/usuario/' + req.user.id);
          });
        })(req, res, next);

      })
    }
  }
]

//Formulario paraeditar usuario
exports.editar_get = [
  function (req, res, next) {
    if (!req.user) {
      res.redirect('/usuario/login')
    }
    next()
  }
  , function (req, res, next) {
    Usuario.encontrarUno({
      campo: 'id',
      valor: req.params.id
    })
      .then(result => {
        if (result.id == req.user.id) {
          res.render('usuario/form', {
            title: 'Editar usuario',
            usuarioCampos: req.user,
            action: '/usuario/editar/' + req.params.id
          })
        } else {
          res.redirect('/')
        }
      })
      .catch(err => {
        console.error(err)
      })
  }
]

//Actualizar datos de usuario existente
exports.editar_post = [
  function (req, res, next) {
    if (!req.user) {
      res.redirect('/')
    }
    next()
  }
  //Validación de datos
  ,
  validacionUsuario()
  ,
  function (req, res, err) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      req.flash('mensaje_error', 'Se han producido los siguientes errores:')
      res.render('usuario/form', {
        title: 'Editar usuario',
        usuarioCampos: req.body,
        action: '/usuario/editar/' + req.params.id,
        errors: errors.array(),
        mensaje_error: req.flash('mensaje_error')
      })
      return
    } else {
      if (req.params.id == req.user.id) {
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

        req.flash('mensaje_exito', 'Usuario modificado con éxito')
        res.redirect('/usuario/' + req.params.id)
      } else {
        res.redirect('/')
      }
    }
  }
]

//Muestra confirmación para eliminar usuario
exports.eliminar_get = [
  function (req, res, next) {
    if (!req.user) {
      res.redirect('/usuario/login')
    }
    next()
  }
  , function (req, res, next) {
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
]

//Borra el usuario
exports.eliminar_post = [
  function (req, res, next) {
    if (!req.user) {
      res.redirect('/usuario/login')
    }
    next()
  }
  , function (req, res, next) {
    if (req.user.id == req.params.id) {
      const id = req.user.id
      req.logout()
      Usuario.eliminar(id)
        .then(resultado => {

          req.flash('mensaje_exito', 'Usuario eliminado con éxito')
          res.redirect('/')
        })
        .catch(err => console.error(err.stack))
    } else {
      res.redirect('/')
    }
  }
]
//Muestra el perfil del usuario
exports.perfil = function (req, res, next) {
  if (req.user && req.user.id == req.params.id) {
    Promise.all([
      Aeropuerto.encontrarTodos(),
      Reserva.encontrarTodasUsuario(req.params.id)
    ])
      .then(result => {
        res.render('usuario/perfil', {
          title: 'Perfil',
          aeropuertos: result[0],
          reservas: result[1],
        })
        return
      })
  } else {
    res.redirect('/usuario/login')
  }
}

exports.login_get = function (req, res, next) {
  res.render('usuario/login', { title: 'Iniciar sesión', mensaje_error: req.flash('error') })
}


exports.logout = function (req, res) {
  req.logout()
  res.redirect('/')
}