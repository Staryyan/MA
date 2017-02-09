/**
 * Created by yanzexin on 09/02/2017.
 * All right reserved @Stary 09/02/2017
 */
var fs = require('fs');

var Score = require('../models/Score');


var CSVCreator = function () {
};

var pro = CSVCreator.prototype;

pro.stringify = function (scoreList) {
    var buffer = "";
    buffer += '"' + '学号' + '","' + '分数"\n';
    for (var each of scoreList) {
        buffer += '="' + each['studentId'] + '","' + each['score'] + '"\n';
    }
    return buffer;
};

pro.writeData = function (fileName, homeworkId) {
    var that = this;
    Score.getAllScores(homeworkId, function (data) {
        if (data['succeed']) {
            fs.writeFile(fileName, that.stringify(data['data']), function (error) {
                console.log(error);
                if (error) {
                    console.log(error);
                }
            });
        }
    });
};

module.exports = CSVCreator;
