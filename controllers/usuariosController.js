const Usuario = require('../models/usuario')
const {
  body,
  validationResult
} = require("express-validator");

//Formulario para crear usuario
exports.crear_usuario_get = function (req, res, next) {
  res.render('usuario_form', {
    title: 'Crear usuario',
    usuario: undefined,
    action: '/usuario/crear',
    errors: null
  });
};

//Envío de formulario para crear usuario
exports.crear_usuario_post = [
  //Sanitazación y validación de datos
  body('nombre').trim()
    .isLength({ min: 2 }).escape().withMessage('Debe introducir un nombre')
    .isAlphanumeric('es-ES').withMessage('Nombre debe contener solamente carácteres alfanuméricos'),
  body('apellidos').trim()
    .isLength({ min: 2 }).escape().withMessage('Debe introducir un nombre')
    .isAlphanumeric('es-ES').withMessage('Apellidos debe contener solamente carácteres alfanuméricos'),
  body('email')
    .isEmail().withMessage('Email no válido')
    .normalizeEmail()
    .custom(valor => {
      return Usuario.encontrarUno({
        campo: 'email',
        valor: valor
      }).then(email => {
        if (email) return Promise.reject('Email existente');
      })
    }),
  body('dni')
    .trim()
    .isLength({ min: 9, max: 9 }).withMessage('Dni no válido')
    .toUpperCase()
    .escape()
    .custom(valor => {
      return Usuario.encontrarUno({
        campo: 'dni',
        valor: valor
      }).then(dni => {
        if (dni) return Promise.reject('Dni existente');
      })
    }),

  body('edad').isInt({ min: 18 }).withMessage('Debe ser mayor de edad'),

  function (req, res, err) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('usuario_form', {
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
        res.render('usuario_form', {
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
  body('nombre')
    .trim()
    .isLength({ min: 2 }).escape().withMessage('Debe introducir un nombre')
    .isAlphanumeric('es-ES').withMessage('Nombre debe contener solamente carácteres alfanuméricos'),
  body('apellidos').trim()
    .isLength({ min: 2 }).escape().withMessage('Debe introducir un nombre')
    .isAlphanumeric('es-ES').withMessage('Apellidos debe contener solamente carácteres alfanuméricos'),
  body('email')
    .isEmail().withMessage('Email no válido')
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
    .isLength({ min: 9, max: 9 }).withMessage('Dni no válido')
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

  function (req, res, err) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.render('usuario_form', {
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


exports.perfil_usuario = function (req, res, next) {
  res.render('perfil_usuario', {
    title: 'Usuario',
    usuario: undefined,
    errors: null
  })
}