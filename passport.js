const Usuario = require('./models/usuario')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(
  new LocalStrategy({
    usernameField: 'email'
  }
    , (email, password, done) => {
      Usuario.encontrarUno({ campo: 'email', valor: email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: "Email no existe o es incorrecto" });
          }
          bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              return done(null, user)
            } else {
              return done(null, false, { message: "Contraseña incorrecta" })
            }
          })
        })
        .catch(err => {
          return done(null, false, {message: 'jojo'});
        })
    })
)

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Usuario.encontrarUno({ campo: 'id', valor: id })
    .then(user => {
      done(null, user)
    })
    .catch(err => {
      done(err);
    })
});
