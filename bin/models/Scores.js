/**
 * Created by yanzexin on 03/02/2017.
 * All right reserved @Stary 03/02/2017
 */
'use strict';
var mongoose = require('mongoose');
var _ = require('underscore');
var Schema = mongoose.Schema;
var ScoreSchema = new Schema({
    homeworkId: String,
    studentId: String,
    score: String,
    files: String
});

ScoreSchema.statics.handInHomework = function (will_score, cb) {
    this.findOne({homeworkId: will_score.homeworkId, studentId: will_score.studentId}, function (record) {
        if (record) {
            record.score = will_score.score;
            record.save().then(function (data) {
                if (data) {
                    cb({'succeed': true});
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
                score: 0,
                files: will_score.files
            });
            score.save().then(function (data) {
                if (data) {
                    cb({'succeed': true});
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


ScoreSchema.statics.getAllScores = function (user, cb) {
    this.find({studentId: user.studentId}).then(function (records) {
        if (records) {
            cb({'succeed': true, 'data': records});
        } else {
            cb({'succeed': false});
        }
    }).catch(function (error) {
        console.log(error);
        cb({'succeed': false, 'error': error});
    });
};

function averageScore(scores) {
    var averageScore = 0;
    var times = 0;
    _.each(scores, function (num) {
        averageScore += num;
        times++;
    });
    averageScore /= times;
    return averageScore;
}

ScoreSchema.statics.finishCheck = function (homework, cb) {
    this.find({homeworkId: homework.homeworkId}).then(function (records) {
        var scores = _.pluck(records, 'score');
        var averageScore = averageScore(scores);
        var maxScore = _.max(scores);
        var record = new Score({
            homeworkId: homework.homeworkId,
            state: 'finished',
            averageScore: averageScore,
            maxScore: maxScore
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
    });
};

ScoreSchema.statics.getAverageScoreByHomeworkId = function (homework, cb) {
    this.findOne({homeworkId: homework.homeworkId, state: 'finished'}).then(function (record) {
        if (record) {
            cb({'succeed': true, 'averageScore': record.averageScore, 'maxScore': record.maxScore});
        } else {
            cb({'succeed': false, 'error': '未改完作业.'});
        }
    }).catch(function (error) {
        console.log(error);
        cb({'succeed': false, 'error': error});
    });
};

var Score = mongoose.model('Score', ScoreSchema);

module.exports = Score;
