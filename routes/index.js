var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { });
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

module.exports = router;
