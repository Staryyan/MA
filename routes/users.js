var express = require('express');
var router = express.Router();
var User = require('../bin/models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function (request, response) {
  console.log('login');
  User.logInCheck({studentId: request.body.studentId, password: request.body.password}, function (data, user) {
    if (data['succeed']) {
      if (request.body.remember != 'false') {
        response.cookie('user', {name: request.body.name, status: user[0].status}, { httpOnly:true, maxAge: 360 * 3600 * 3600});
      } else {
        response.cookie('user', {name: request.body.name, status: user[0].status}, { httpOnly:true});
      }
      response.json({'succeed': true});
    } else {
      response.json(data);
    }
  });
});

module.exports = router;
