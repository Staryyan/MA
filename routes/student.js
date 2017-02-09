/**
 * Created by yanzexin on 05/02/2017.
 * All right reserved @Stary 05/02/2017
 */

var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');

var Homework = require('../bin/models/Homework');
var Score = require('../bin/models/Score');

router.post('/uploadHomework', function (request, response) {
    console.log('uploadHomework');
    fs.mkdir('private/homework', function () {
        var form = formidable.IncomingForm();
        form._encoding = 'utf-8';
        form.uploadDir = 'private/homework/';
        form.keepExtensions = true;
        form.hash = false;
        form.maxFieldsSize = 20 * 1024 * 1024;
        form.maxFileSize = 1;
        form.parse(request, function (err, field, files) {
            if (err) {
                response.render('error');
            } else {
                var path = '';
                if (files['file']['size'] != 0) {
                    path = files['file']['path'].toString();
                }
                Score.handInHomework({
                    homeworkId: field['homeworkId'],
                    studentId: field['studentId'],
                    files: path
                }, function (data) {
                    response.json(data);
                });
            }
        });
    });
});

router.get('/getFiles', function (request, response) {
    console.log('getFiles');
    var query = request.query;
    var cookies = request.cookies.user;
    var type = query.files.split('.');
    type = type[type.length - 1];
    response.download(query.files, '' + cookies.studentId + '+' + query.homeworkName + '.' + type);
});

router.post('/loadScore', function (request, response) {
    console.log('loadScore');
    Score.getAllScoresByStudentId(request.body.studentId, function (data) {
        response.json(data);
    });
});

router.post('/loadHomeworkList', function (request, response) {
    console.log('loadHomeworkList');
    Homework.getHomeworkForComment(function (data) {
        if (data['succeed']) {
            response.json(data);
        }
    });
});

router.post('/loadScoreList', function (request, response) {
    console.log('loadScoreList');
    Score.getAllScoresByStudentId(request.body.studentId, function (data) {
        if (data['succeed']) {
            response.json(data);
        }
    });
});

module.exports = router;
