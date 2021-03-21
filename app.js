require('./db/connection')

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const compression = require('compression')
const helmet = require('helmet')


const logger = require('morgan');

const cookieParser = require('cookie-parser');
const session = require('express-session')
const passport = require('passport')

const flash = require('connect-flash');

const layouts = require('express-ejs-layouts');

const usuariosRouter = require('./routes/usuarios');
const estaticosRouter = require('./routes/estaticos')
const vuelosRouter = require('./routes/vuelos')
const reservasRouter = require('./routes/reservas');

const app = express();

//configuración motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(layouts)

if (app.get('env') === 'production'){
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//configuración de sesiones y cookies
app.use(cookieParser('proyecto'))
app.use(session({ cookie:{maxAge: 60000}, secret: "proyecto", resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

//mensajes flash
app.use(flash());

//Valores por de fecto para las variables locales en las respuestas
app.use(function (req, res, next) {
  res.locals.title = 'default'
  res.locals.errors = null
  res.locals.usuario = req.user
  res.locals.mensaje_error = req.flash('mensaje_error');
  res.locals.mensaje_exito = req.flash('mensaje_exito');
  next()
})

//Compresor de las rutas en las respuestas
app.use(compression())

//Protege de las vulnerabilidades comunes en la web
app.use(helmet())

//Rutas
app.use('/', estaticosRouter)
app.use('/usuario', usuariosRouter);
app.use('/vuelos', vuelosRouter)
app.use('/reservas', reservasRouter)

// Captura un error 404 y pasa al gestor de errores
app.use(function (req, res, next) {
  next(createError(404));
});

// Gestor de errores
app.use(function (err, req, res, next) {
  // Asigna loserroes a las variables locales solamente en desarrollo
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderiza la página de error
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
