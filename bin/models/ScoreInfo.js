/**
 * Created by yanzexin on 04/02/2017.
 * All right reserved @Stary 04/02/2017
 */
'use strict';
var mongoose = require('mongoose');
var _ = require('underscore');

var Score = require('./Score');

var Schema = mongoose.Schema;
var ScoreInfoSchema = new Schema({
    homeworkId: String,
    size: Number,
    average: Number,
    max: Number
});

ScoreInfoSchema.statics.finishHomework = function (homeworkId, cb) {
    Score.getAllScores(homeworkId, function (data) {
        if (data['succeed']) {
            var scores = _.pluck(data['data'], 'score');
            var averageScore = 0;
            var times = 0;
            _.each(scores, function (num) {
                averageScore += num;
                times++;
            });
            averageScore /= times;
            var maxScore = _.max(scores);
            var record = new ScoreInfo({
                homeworkId: homeworkId,
                size: scores.length,
                average: averageScore,
                max: maxScore
            });
            record.save().then(function (data) {
                if (data) {
                    cb({'succeed': true});
                } else {
                    cb({'succeed': false});
                }
            }).catch(function (error) {
                console.log(error);
                cb({'succeed': true, 'error': error});
            });
        } else {
            cb({'succeed': false, 'error': data['error']});
        }
    });
};

ScoreInfoSchema.statics.getAverageScoreByHomeworkId = function (homeworkId, cb) {
    this.findOne({homeworkId: homeworkId}).then(function (record) {
        if (record) {
            cb({'succeed': true, 'averageScore': record.average, 'maxScore': record.max});
        } else {
            cb({'succeed': false, 'error': '未改完作业.'});
        }
    }).catch(function (error) {
        console.log(error);
        cb({'succeed': false, 'error': error});
    });
};

ScoreInfoSchema.statics.getAllScoreInfo = function (cb) {
    this.find().then(function (records) {
        if (records) {
            cb({'succeed': true, 'data': records});
        } else {
            cb({'succeed': false});
        }
    }).catch(function (error) {
        cb({'succeed': false, 'error': error});
    });
};

var ScoreInfo = mongoose.model('ScoreInfo', ScoreInfoSchema);

module.exports = ScoreInfo;
