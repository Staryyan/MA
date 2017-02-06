var express = require('express');
var router = express.Router();

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

router.get('/admin_importUsers', function (request, response) {
  response.render('admin_importUsers');
});

router.get('/admin_publishHomework', function (request, response) {
  response.render('admin_publishHomework');
});

router.get('/admin_scores', function (request, response) {
  response.render('admin_scores');
});

router.get('/student_home', function (request, response) {
  response.render('student_home', getCookieInfo(request));
});

router.get('/TA_evaluate', function (request, response) {
  response.render('TA_evaluate', {homeworksList: [
    {homeworkId: '1', studentId: '15331348', name: '颜泽鑫', score: '99', comment: ''},
    {homeworkId: '1', studentId: '15331349', name: '颜泽鑫', score: '99', comment: ''},
    {homeworkId: '1', studentId: '15331340', name: '颜泽鑫', score: '99', comment: ''},
    {homeworkId: '1', studentId: '15331341', name: '颜泽鑫', score: '99', comment: ''},
    {homeworkId: '1', studentId: '15331342', name: '颜泽鑫', score: '99', comment: ''},
    {homeworkId: '1', studentId: '15331343', name: '颜泽鑫', score: '99', comment: ''},
    {homeworkId: '1', studentId: '15331344', name: '颜泽鑫', score: '99', comment: ''}]});
});

router.get('/profile', function (request, response) {
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
