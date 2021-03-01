// var express = require('express');
// var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// REQUIRE CONTROLLER
const UsuariosController = require('../controllers/usuariosController');

module.exports = (app) => {
    app.get('/', UsuariosController.getArticles);
    app.post('/new', UsuariosController.createArticle);
    app.put('/update/article/:id', UsuariosController.updateArticle);
    app.delete('/delete/article/:id', UsuariosController.deleteArticle);
}

module.exports = router;
