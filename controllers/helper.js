const { body } = require("express-validator");
const Usuario = require('../models/usuario')

exports.validacionUsuario = function() {
  return [
    body('nombre')
      .trim()
      .isLength({ min: 2 }).escape().withMessage('Debe introducir un nombre').bail()
      .isAlphanumeric('es-ES').withMessage('Nombre debe contener solamente carácteres alfanuméricos'),
    body('apellidos').trim()
      .isLength({ min: 2 }).escape().withMessage('Debe introducir apellidos').bail()
      .isAlphanumeric('es-ES').withMessage('Apellidos debe contener solamente carácteres alfanuméricos'),
    body('email')
      .isEmail().withMessage('Email no válido').bail()
      .normalizeEmail()
      .custom((valor, { req }) => {
        return Usuario.encontrarUno({ campo: 'email', valor: valor })
          .then(res => {
            if (res) {
              if (!(res.id == req.params.id)) {
                return Promise.reject('Email existente')
              }
            }
          })
      }),
    body('dni')
      .trim()
      .toUpperCase()
      .isLength({ min: 9, max: 9 }).withMessage('Dni no válido').bail()
      .escape()
      .custom((valor, { req }) => {
        return Usuario.encontrarUno({ campo: 'dni', valor: valor })
          .then(res => {
            if (res) {
              if (!(res.id == req.params.id)) {
                return Promise.reject('Dni existente')
              }
            }
          })
      }),

    body('edad').isInt({ min: 18 }).withMessage('Debe ser mayor de edad'),
  ]
}