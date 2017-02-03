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
        response.cookie('user', {name: user[0].name, status: user[0].status, studentId: user[0].studentId, email: user[0].email}, { httpOnly:true, maxAge: 360 * 3600 * 3600});
      } else {
        response.cookie('user', {name: user[0].name, status: user[0].status, studentId: user[0].studentId, email: user[0].email}, { httpOnly:true});
      }
      response.json({'succeed': true});
    } else {
      response.json(data);
    }
  });
});

router.post('/changePassword', function (request, response) {
  console.log('changePassword');
  User.changePassword(
      {studentId: request.cookies.user.studentId,
        originalPassword: request.body.originalPassword,
        newPassword: request.body.newPassword},
      function (data) {
    response.json(data);
  });
});

module.exports = router;
