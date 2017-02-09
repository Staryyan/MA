var express = require('express');
var router = express.Router();

var Homework = require('../bin/models/Homework');
var User = require('../bin/models/User');
var Score = require('../bin/models/Score');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {});
});

router.get('/login', function (request, response) {
  response.render('login');
});

router.get('/logout', function (request, response) {
  response.clearCookie('user');
  response.render('login');
});

router.get('/admin_home', function (request, response) {
  response.render('admin_home');
});

router.get('/admin_viewUsers_student', function (request, response) {
  User.findUserByStatus('Student', function (data) {
    if (data['succeed']) {
      response.render('admin_viewUsers', {'userList': data['data'], 'status': 'student'});
    }
  })
});

router.get('/admin_viewUsers_TA', function (request, response) {
  User.findUserByStatus('TA', function (data) {
    if (data['succeed']) {
      response.render('admin_viewUsers', {'userList': data['data'], 'status': 'TA'});
    }
  })
});

router.get('/admin_importUsers', function (request, response) {
  response.render('admin_importUsers');
});

router.get('/admin_publishHomework', function (request, response) {
  response.render('admin_publishHomework');
});

router.get('/admin_scores', function (request, response) {
  getHomeworkList(function (data) {
    if (data['succeed']) {
      if (request.query.homeworkId) {
        Score.getAllScores(request.query.homeworkId, function (records) {
          if (records['succeed']) {
            response.render('admin_scores', {
              homeworkList: data['data'],
              scoreList: records['data'],
              selectedTitle: request.query.homeworkTitle
            });
          }
        });
      } else {
        Score.getAllScores(data['data'][0]['_id'], function (records) {
          if (records['succeed']) {
            response.render('admin_scores', {
              homeworkList: data['data'],
              scoreList: records['data'],
              selectedTitle: data['data'][0]['title']
            });
          }
        });
      }
    } else {
      response.render('admin_scores');
    }
  });
});

function getHomeworkList(cb) {
  Homework.getHomework('finish', function (data) {
    cb(data);
  })
}

router.get('/student_home', function (request, response) {
  response.render('student_home', getCookieInfo(request));
});

router.get('/TA_home', function (request, response) {
  response.render('TA_home', getCookieInfo(request));
});

router.get('/TA_evaluate', function (request, response) {
  response.render('TA_evaluate');
});

router.get('/profile', function (request, response) {
  var userCookie = getCookieInfo(request);
  if (userCookie.status == 'admin') {
    href = 'admin_profile';
  } else if (userCookie.status == 'TA') {
    href = 'TA_profile';
  } else {
    href = 'student_profile';
  }
  response.render(href, getCookieInfo(request));
});

router.get('/home', function (request, response) {
  var status = request.cookies.user['status'];
  var href = '';
  console.log(status);
  if (status == 'admin') {
    href = './admin_home';
  } else if (status == 'TA') {
    href = './TA_home';
  } else {
    href = './student_home';
  }
  response.writeHead('302', {'location': href});
  response.end();
});

function getCookieInfo(request) {
  var userCookie = request.cookies.user;
  return {
    studentId: userCookie.studentId,
    name: userCookie.name,
    email: userCookie.email
  };
}

module.exports = router;
