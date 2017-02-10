var express = require('express');
var router = express.Router();

var User = require('../bin/models/User');
var Homework = require('../bin/models/Homework');
var ScoreInfo = require('../bin/models/ScoreInfo');
var HomeworkStatics = require('../bin/models/HomeworkStatics');

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

router.post('/loadHomework', function (request, response) {
  Homework.getHomework(undefined, function (data) {
    response.json(data);
  });
});

router.post('/loadScoreInfo', function (request, response) {
  console.log('loadScoreInfo');
  ScoreInfo.getAllScoreInfo(function (data) {
    response.json(data);
  });
});

router.get('/getStaticsFile', function (request, response) {
  console.log('getStaticsFile');
  Homework.getHomeworkById(request.query.homeworkId, function (data) {
    if (data['succeed']) {
      HomeworkStatics.getFileName(request.query.homeworkId, function (record) {
        if (record['succeed']) {
          response.download(record['data']['file'], data['data']['title'] + '.csv');
        }
      })
    }
  })
});

router.post('/TAList', function (request, response) {
  console.log('TAList');
  User.findUserByStatus('TA', function (data) {
    response.json(data);
  })
});

module.exports = router;
