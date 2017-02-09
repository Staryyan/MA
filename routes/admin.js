/**
 * Created by yanzexin on 31/01/2017.
 * All right reserved @Stary 31/01/2017
 */
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var Parser = require('../bin/utils/CSVParser');

var User = require('../bin/models/User');
var Homework = require('../bin/models/Homework');
var ScoreInfo = require('../bin/models/ScoreInfo');
var HomeworkStatics = require('../bin/models/HomeworkStatics');

router.post('/previewUser', function (request, response) {
    console.log('previewUser');
    var form = formidable.IncomingForm();
    form._encoding = 'utf-8';
    form.uploadDir = 'private/';
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

router.post('/publishHomework', function (request, response) {
    console.log('publishHomework');
    Homework.publish({
        title: request.body.title,
        beginTime: request.body.beginTime,
        deadline: request.body.deadline,
        url: request.body.url
    }, function (data) {
            console.log(data);
            response.json({'succeed': true});
        });
});

router.get('/downloadDemo', function (request, response) {
    console.log('downloadDemo');
    response.download('private/demo.csv', 'demo.csv');
});

router.get('/downloadScore', function (request, response) {
    console.log('downloadScore');
    console.log(request.query.homeworkId);
    HomeworkStatics.getFileName(request.query.homeworkId, function (data) {
        if (data['succeed']) {
            response.download(data['data']['file'],  request.query.homeworkTitle + '成绩表.csv');
        }
    });
});

module.exports = router;
