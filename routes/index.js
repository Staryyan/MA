var express = require('express');
var router = express.Router();

var _ = require('underscore');

var Homework = require('../bin/models/Homework');
var User = require('../bin/models/User');
var Score = require('../bin/models/Score');
var Writer = require('../bin/utils/CSVCreator');
var HomeworkStatics = require('../bin/models/HomeworkStatics');
var writer = new Writer();


/* GET home page. */
router.get('/', function(request, response, next) {
  response.writeHead('302', {'location': './home'});
  response.end();
});

router.get('/login', function (request, response) {
  response.render('login');
});

router.get('/logout', function (request, response) {
  response.clearCookie('user');
  response.render('login');
});

router.get('/profile', function (request, response) {
  isLogin(request, response, function () {
    var userCookie = getCookieInfo(request);
    if (userCookie.status == 'teacher') {
      href = 'teacher_profile';
    } else if (userCookie.status == 'admin') {
      href = 'admin_profile';
    } else if (userCookie.status == 'TA') {
      href = 'TA_profile';
    } else {
      href = 'student_profile';
    }
    response.render(href, userCookie);
  });
});

router.get('/home', function (request, response) {
  isLogin(request, response, function () {
    var status = request.cookies.user['status'];
    var href = '';
    if (status == 'teacher') {
      href = './teacher_home';
    } else if (status == 'admin') {
      href = './admin_home';
    } else if (status == 'TA') {
      href = './TA_home';
    } else {
      href = './student_home';
    }
    response.writeHead('302', {'location': href});
    response.end();
  })
});

router.get('/scores', function (request, response) {

  console.log('scores');

  isLogin(request, response, function () {
    var userCookies = getCookieInfo(request);

    if (!userCookies) {
      unvalidVisit(response);
    } else {
      var href = '';
      if (userCookies.status == 'teacher') {
        href = 'teacher_scores';
      } else if (userCookies.status == 'TA') {
        href = 'TA_scores';
      } else {
        href = 'student_scores';
      }

      getHomeworkList(function (data) {
        if (data['succeed'] && data['data'].length) {
          if (request.query.homeworkId) {

            Score.getAllScores(request.query.homeworkId, function (records) {
              if (records['succeed']) {
                for (var each of records['data']) {
                  each['comment'] = '';
                  each['files'] = '';
                  each['homeworkId'] = '';
                }
                console.log(records['data']);
                response.render(href, {
                  homeworkList: data['data'],
                  scoreList: records['data'],
                  selectedTitle: request.query.homeworkTitle,
                  selectedId: request.query.homeworkId
                });
              }
            });

          } else {
            
            Score.getAllScores(data['data'][0]['_id'], function (records) {
              if (records['succeed']) {
                for (var each of records['data']) {
                  each['comment'] = '';
                  each['files'] = '';
                  each['homeworkId'] = '';
                }
                response.render(href, {
                  homeworkList: data['data'],
                  scoreList: records['data'],
                  selectedTitle: data['data'][0]['title'],
                  selectedId: data['data'][0]['_id']
                });
              }
            });

          }
        } else {
          response.render(href, {
            homeworkList: [],
            scoreList: [],
            selectedTitle: null,
            selectedId: null
          });
        }
      });
    }
  });
});

router.get('/downloadScore', function (request, response) {
  console.log('downloadScore');
    HomeworkStatics.getFileName(request.query.homeworkId, function (data) {
      if (data['succeed']) {
        response.download(data['data']['file'],  request.query.homeworkTitle + '成绩表.csv');
      }
    });
});

/**
 * admin Get router.
 */

router.get('/admin_home', function (request, response) {
  isValidVisitWithStatus(request, response, 'admin', function () {
    response.render('admin_home');
  })
});

router.get('/admin_viewUsers_teacher', function (request, response) {
  isValidVisitWithStatus(request, response, 'admin', function () {
    User.findUserByStatus('teacher', function (data) {
      if (data['succeed']) {
        response.render('admin_viewUsers', {'userList': data['data'], 'status': 'teacher'});
      }
    })
  });
});

router.get('/admin_viewUsers_student', function (request, response) {
  isValidVisitWithStatus(request, response, 'admin', function () {
    User.findUserByStatus('Student', function (data) {
      if (data['succeed']) {
        response.render('admin_viewUsers', {'userList': data['data'], 'status': 'Student'});
      }
    })
  });
});

router.get('/admin_viewUsers_TA', function (request, response) {
  isValidVisitWithStatus(request, response, 'admin', function () {
    User.findUserByStatus('TA', function (data) {
      if (data['succeed']) {
        response.render('admin_viewUsers', {'userList': data['data'], 'status': 'TA'});
      }
    });
  });
});

router.get('/admin_importUsers', function (request, response) {
  isValidVisitWithStatus(request, response, 'admin', function () {
    response.render('admin_importUsers');
  });
});

/**
 * teacher Get router.
*/
router.get('/teacher_home', function (request, response) {
  isValidVisitWithStatus(request, response, 'teacher', function () {
    response.render('teacher_home');
  });
});

router.get('/teacher_publishHomework', function (request, response) {
  isValidVisitWithStatus(request, response, 'teacher', function () {
    response.render('teacher_publishHomework');
  });
});

router.get('/teacher_evaluate', function (request, response) {
  isValidVisitWithStatus(request, response, 'teacher', function () {
    response.render('teacher_evaluate');
  })
});


/**
 * Student Get router.
 */
router.get('/student_home', function (request, response) {
  isValidVisitWithStatus(request, response, 'Student', function () {
    response.render('student_home', getCookieInfo(request));
  });
});

router.get('/student_scores', function (request, response) {
  isValidVisitWithStatus(request, response, 'Student', function () {
    response.render('student_scores', getCookieInfo(request));
  });
});

router.get('/student_comment', function (request, response) {
  isValidVisitWithStatus(request, response, 'Student', function () {
    response.render('student_comment', getCookieInfo(request));
  });
});

/**
 * TA Get router.
 */
router.get('/TA_home', function (request, response) {
  isValidVisitWithStatus(request, response, 'TA', function () {
    response.render('TA_home', getCookieInfo(request));
  });
});

router.get('/TA_evaluate', function (request, response) {
  isValidVisitWithStatus(request, response, 'TA', function () {
    response.render('TA_evaluate', getCookieInfo(request));
  });
});

function getCookieInfo(request) {
  var userCookie = request.cookies.user;
  if (userCookie) {
    return {
      studentId: userCookie.studentId,
      name: userCookie.name,
      email: userCookie.email,
      status: userCookie.status
    };
  } else {
    return null;
  }
}

function isValidVisitWithStatus(request, response, status, cb) {
  var cookies = getCookieInfo(request);
  if (cookies && cookies.status == status) {
    cb();
  } else {
    unvalidVisit(response);
  }
}


function getHomeworkList(cb) {
  Homework.getHomework('finish', function (data) {
    cb(data);
  })
}

function isLogin(request, response, cb) {
  var cookies = getCookieInfo(request);
  if (cookies) {
    cb(cookies);
  } else {
    unvalidVisit(response);
  }
}

function unvalidVisit(response) {
  response.writeHead('302', {'location': './login'});
  response.end();
}

module.exports = router;
