const Usuario = require('../models/usuario')
const { validationResult } = require("express-validator")
const { validacionUsuario } = require('./helper');


//Formulario para crear usuario
exports.crear_usuario_get = function (req, res, next) {
  res.render('usuario/form', {
    title: 'Crear usuario',
    usuario: undefined,
    action: '/usuario/crear',
    errors: null
  });
};

//Envío de formulario para crear usuario
exports.crear_usuario_post = [
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
      const data = {
        dni: req.body.dni,
        email: req.body.email,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        edad: req.body.edad
      }

      //Consulta para crear registro
      Usuario.crear(data)

      res.redirect('/')
    }
  }
]

//Formulario paraeditar usuario
exports.editar_usuario_get = function (req, res, next) {
  Usuario.encontrarUno({
    campo: 'id',
    valor: req.params.id
  })
    .then(result => {
      if (result) {
        res.render('usuario/form', {
          title: 'Editar usuario',
          usuario: result,
          action: '/usuario/editar/1',
          errors: null
        })
      } else {
        res.redirect('/')
      }
    })
    .catch(err => {
      console.log(err)
    })
}

//Actualizar datos de usuario existente
exports.editar_usuario_post = [
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

//Borra el usuario

exports.eliminar = function (req, res, next) {

}

//Muestra el perfil del usuario
exports.perfil_usuario = function (req, res, next) {
  Usuario.encontrarUno({ campo: 'id', valor: req.params.id })
    .then(resultado => {
      if (resultado) {
        res.render('usuario/perfil', {
          title: 'Usuario',
          usuario: resultado,
          errors: null
        })
        return
      }
      res.redirect('/')
    })

}
