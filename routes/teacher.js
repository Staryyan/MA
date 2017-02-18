/**
 * Created by yanzexin on 31/01/2017.
 * All right reserved @Stary 31/01/2017
 */
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var archiver = require('archiver');

var Parser = require('../bin/utils/CSVParser');
var User = require('../bin/models/User');
var Homework = require('../bin/models/Homework');
var HomeworkStatics = require('../bin/models/HomeworkStatics');
var ScoreInfo = require('../bin/models/ScoreInfo');
var Score = require('../bin/models/Score');
var Writer = require('../bin/utils/CSVCreator');
var writer = new Writer();


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

router.post('/TAList', function (request, response) {
    console.log('TAList');
    User.findUserByStatus('TA', function (data) {
        response.json(data);
    })
});

router.post('/evaluateHomeworkList', function (request, response) {
    console.log('evaluateHomeworkList');
    Homework.getEvaluatingHomeworkList(function (data) {
        response.json(data);
    });
});

router.post('/homeworkList', function (request, response) {
    console.log('homeworkList');
    Score.getAllScores(request.body.homeworkId, function (data) {
        response.json(data);
    });
});

router.post('/finishEvaluating', function (request, response) {
    console.log('finishEvaluating');

    createBestHomeworkZip(request.body.homeworkId);
    
    var fileName = ['private/homeworkStatics/', request.body.homeworkId, '.csv'].join('');

    writer.writeData(fileName, request.body.homeworkId);

    HomeworkStatics.createStaticsFile(request.body.homeworkId, fileName, function (data) {
        console.log(data);
    });

    Homework.afterEvaluate(request.body.homeworkId);

    ScoreInfo.finishHomework(request.body.homeworkId, function (data) {
        response.json(data);
    });
});

function createBestHomeworkZip(homeworkId) {
    console.log('downloadBestHomework');
    var files = [];
    var zipPath = 'private/homeworkZip/' + homeworkId + '.zip';
    var output = fs.createWriteStream(zipPath);
    var zipArchiver = archiver('zip');
    zipArchiver.pipe(output);
    Score.getAllScores(homeworkId, function (data) {
        if (data['succeed']) {
            for (var index = 0; index < data['data'].length; index++) {
                each = data['data'][index];
                if (each['score'] == data['data'][0]['score']) {
                    var type = each['files'].split('.');
                    type = type[type.length - 1];
                    zipArchiver.append(fs.createReadStream(each['files']), {'name': each['studentId'] + '.' + type});
                }
            }
        }
        zipArchiver.finalize();
    })
}

module.exports = router;
