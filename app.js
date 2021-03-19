require('./db/connection')

// import('./models/usuario.js')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const session = require('express-session')
const passport = require('passport')

var flash = require('connect-flash');

const layouts = require('express-ejs-layouts');


const usuariosRouter = require('./routes/usuarios');
const estaticosRouter = require('./routes/estaticos')
const vuelosRouter = require('./routes/vuelos')
const reservasRouter = require('./routes/reservas');
const cookieParser = require('cookie-parser');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(layouts)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser('proyecto'))
app.use(session({ cookie:{maxAge: 60000}, secret: "proyecto", resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash());


app.use(function (req, res, next) {
  res.locals.title = 'default'
  res.locals.errors = null
  res.locals.usuario = req.user
  res.locals.mensaje_error = req.flash('mensaje_error');
  res.locals.mensaje_exito = req.flash('mensaje_exito');
  next()
})

app.use('/', estaticosRouter)
app.use('/usuario', usuariosRouter);
app.use('/vuelos', vuelosRouter)
app.use('/reservas', reservasRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
