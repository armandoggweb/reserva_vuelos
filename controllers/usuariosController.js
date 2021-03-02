const Usuario = require('../models/usuario')
const { body, validationResult } = require("express-validator");


exports.crear_usuario_get = function (req, res, next) {
  res.render('usuario_form', { title: 'Crear usuario', usuario: undefined, errors: null });
};

exports.crear_usuario_post = [
  body('nombre').trim().isLength({ min: 2 }).escape().withMessage('Debe introducir un nombre')
    .isAlphanumeric('es-ES').withMessage('Nombre debe contener solamente carácteres alfanuméricos'),
  body('apellidos').trim().isLength({ min: 2 }).escape().withMessage('Debe introducir un nombre')
    .isAlphanumeric('es-ES').withMessage('Apellidos debe contener solamente carácteres alfanuméricos'),
  body('email')
    .isEmail().withMessage('Email no válido')
    .normalizeEmail()
    .custom(valor => {
      return Usuario.encontrarUno({ campo: 'email', valor: valor }).then(email =>{
        if (email) return Promise.reject('Email existente'); 
      })
    }),
  body('dni')
    .trim()
    .isLength({ min: 9, max: 9 })
    .escape().withMessage('Dni no válido')
    .custom(valor => {
      return Usuario.encontrarUno({ campo: 'dni', valor: valor }).then(dni =>{
        if (dni) return Promise.reject('Dni existente'); 
      })
    }),

  body('edad').isInt({ min: 18 }).withMessage('Debe ser mayor de edad'),

  function (req, res, err) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('usuario_form', { title: 'Crear usuario', usuario: req.body, errors: errors.array() })
      return
    } else {
      const data = {
        dni: req.body.dni,
        email: req.body.email,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        edad: req.body.edad
      }

      Usuario.crear(data)

      res.redirect('/')
    }
  }
]

exports.perfil_usuario = function (req, res, next) {
  res.render('perfil_usuario', { title: 'Usuario', usuario: undefined, errors: null })
}

