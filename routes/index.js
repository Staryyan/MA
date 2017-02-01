var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin_importUsers', { title: 'Express' });
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

module.exports = router;
