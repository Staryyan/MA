/**
 * Created by yanzexin on 18/02/2017.
 * All right reserved @Stary 18/02/2017
 */
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var Parser = require('../bin/utils/CSVParser');

var User = require('../bin/models/User');
var Homework = require('../bin/models/Homework');
var HomeworkStatics = require('../bin/models/HomeworkStatics');
var ScoreInfo = require('../bin/models/ScoreInfo');
var Score = require('../bin/models/Score');

router.post('/previewUser', function (request, response) {
    console.log('previewUser');
    var form = formidable.IncomingForm();
    form._encoding = 'utf-8';
    form.uploadDir = 'private/userData';
    form.keepExtensions = true;
    form.hash = false;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.maxFileSize = 1;
    form.parse(request, function (err, field, files) {
        if (err) {
            response.render('error');
        } else {
            var path = '';
            if (files['file']['size'] != 0) {
                path = files['file']['path'].toString();
            }
            var parser = new Parser();
            parser.computeData(path, function (data) {
                response.json(data);
            });
        }
    });
});

router.post('/submitUser', function (request, response) {
    console.log('submitUser');
    User.importUserList(request.body.userList, request.body.status, function (error) {
        if (error) {
            response.json({'succeed': false});
        } else {
            response.json({'succeed': true});
        }
    })
});

router.get('/downloadDemo', function (request, response) {
    console.log('downloadDemo');
    response.download('private/userData/demo.csv', 'demo.csv');
});

router.post('/deleteAllUsers', function (request, response) {
    User.deleteAllUsers(request.body.status, function (data) {
        response.json(data);
    });
});

router.post('/deleteUsers', function (request, response) {
    User.deleteUserById(request.body.studentId, request.body.status, function (data) {
        response.json(data);
    });
});

router.post('/loadUserList', function (request, response) {
    User.findAllUsers(function (data) {
        response.json(data);
    })
});

module.exports = router;
