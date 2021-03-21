const UsuarioModelo = require('../models/usuario')
const Usuario = new UsuarioModelo

const ReservaModelo = require('../models/reserva')
const Reserva = new ReservaModelo

const AeropuertoModelo = require('../models/aeropuerto')
const Aeropuerto = new AeropuertoModelo

const { validationResult } = require("express-validator")
const { validacionUsuario } = require('./helper');

const bcrypt = require('bcryptjs')
const passport = require('passport');
require('../passport')

//Para modificar y eliminar un usuario o acceder a su perfil habrá que 
//comprobar previamente que el usuario haya iniciado sesión

module.exports = class UsuariosControlador {
  //Formulario para crear usuario
  crear_get() {
    return function (req, res, next) {
      res.render('usuario/form', {
        title: 'Crear usuario',
        action: '/usuario/crear',
        usuarioCampos: undefined
      });
    };
  }

  //Envío de formulario para crear usuario
  crear_post() {
    return [
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
          //Encripta contraseña para almacenarla
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
            //Al crear el usuario, inciia sesión automáticamente
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
  }
  //Formulario para editar usuario
  editar_get() {
    return [
      function (req, res, next) {
        // Comprueba un usuario haya iniciado sesión para poder editar
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
            //Comprueba que el usaurio editar coincida con el usuario logueado
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
  }
  //Actualizar datos de usuario existente
  editar_post() {
    return [
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
  }
  //Muestra confirmación para eliminar usuario
  eliminar_get() {
    return [
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
  }
  //Borra el usuario
  eliminar_post() {
    return [
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
  }
  //Muestra el perfil del usuario
  perfil() {
    return function (req, res, next) {
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
  }

  //Muestra el formulario para inciar sesión
  login_get() {
    return function (req, res, next) {
      res.render('usuario/login', { title: 'Iniciar sesión', mensaje_error: req.flash('error') })
    }
  }

  //Cierra la sesión del usuario logueado
  logout() {
    return function (req, res) {
      req.logout()
      res.redirect('/')
    }
  }
}