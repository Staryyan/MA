/**
 * Created by yanzexin on 03/02/2017.
 * All right reserved @Stary 03/02/2017
 */
'use strict';
var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var Schema = mongoose.Schema;
var ScoreSchema = new Schema({
    homeworkId: String,
    studentId: String,
    comment: String,
    score: Number,
    files: String
});

ScoreSchema.statics.handInHomework = function (will_score, cb) {
    this.findOne({
        homeworkId: will_score.homeworkId,
        studentId: will_score.studentId
    }, function (error, record) {
        if (record) {
            fs.unlink(record.files, function () {
                console.log('delete original files');
            });
            record.files = will_score.files;
            record.save().then(function (data) {
                if (data) {
                    cb({'succeed': true, 'data': data});
                } else {
                    cb({'succeed': false});
                }
            }).catch(function (error) {
                cb({'succeed': false, 'error': error});
                console.log(error);
            })
        } else {
            var score = new Score({
                homeworkId: will_score.homeworkId,
                studentId: will_score.studentId,
                comment: '',
                score: 0,
                files: will_score.files
            });
            score.save().then(function (data) {
                if (data) {
                    cb({'succeed': true, 'data': data});
                } else {
                    cb({'succeed': false});
                }
            }).catch(function (error) {
                cb({'succeed': false, 'error': error});
                console.log(error);
            });
        }
    });
};

ScoreSchema.statics.setScore = function (will_score, cb) {
    this.findOne({homeworkId: will_score.homeworkId, studentId: will_score.studentId}).then(function (record) {
        if (record) {
            record.score = will_score.score;
            record.comment = will_score.comment;
            record.save().then(function (data) {
                if (data) {
                    cb({'succeed': true});
                } else {
                    cb({'succeed': false});
                }
            }).catch(function (error) {
                console.log(error);
                cb({'succeed': false, 'error': error});
            });
        }
    }).catch(function (error) {
        console.log(error);
        cb({'succeed': false, 'error': error});
    });
};

ScoreSchema.statics.getAllScores = function (homeworkId, cb) {
    this.find({homeworkId: homeworkId}).sort({'score': -1}).then(function (records) {
        if (records) {
            cb({'succeed': true, 'data': records});
        } else {
            cb({'succeed': false, 'data': null});
        }
    }).catch(function (error) {
        cb({'succeed': false, 'error': error});
    });
};

ScoreSchema.statics.getAllScoresByStudentId = function (studentId, cb) {
    this.find({studentId: studentId}).then(function (records) {
        if (records) {
            cb({'succeed': true, 'data': records});
        } else {
            cb({'succeed': false, 'error': '空数据'});
        }
    }).catch(function (error) {
        console.log(error);
        cb({'succeed': false, 'error': error});
    });
};

var Score = mongoose.model('Score', ScoreSchema);

module.exports = Score;
