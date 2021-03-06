/**
 * Created by yanzexin on 06/02/2017.
 * All right reserved @Stary 06/02/2017
 */
var express = require('express');
var router = express.Router();

var Homework = require('../bin/models/Homework');
var Score = require('../bin/models/Score');
var ScoreInfo = require('../bin/models/ScoreInfo');
var HomeworkStatics = require('../bin/models/HomeworkStatics');

var Writer = require('../bin/utils/CSVCreator');
var writer = new Writer();

router.post('/evaluateHomeworkList', function (request, response) {
    console.log('evaluateHomeworkList');
    Homework.getEvaluatingHomeworkList(function (data) {
        response.json(data);
    });
});

router.post('/homeworkList', function (request, response) {
    console.log('homeworkList');
    Score.getEvaluateScores(request.body.homeworkId, request.body.TAId, function (data) {
        response.json(data);
    });
});

router.get('/getFiles', function (request, response) {
    console.log('getFiles');
    var type = request.query.files.split('.');
    type = type[type.length - 1];
    console.log(request.query.files);
    response.download(request.query.files,  request.query.studentId + '.' + type);
});

router.post('/saveEvaluate', function (request, response) {
    console.log('saveEvaluate');
    Score.setScore(request.body.score, function (data) {
        response.json(data);
    })
});

module.exports = router;