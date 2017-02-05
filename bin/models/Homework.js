/**
 * Created by yanzexin on 01/02/2017.
 * All right reserved @Stary 01/02/2017
 */
'use strict';
var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;
var ScoreInfo = require('./ScoreInfo');
var HomeworkSchema = new Schema({
    title: String,
    deadline: String,
    url: String,
    state: String
});

HomeworkSchema.statics.publish = function (will_homework, cb) {
    var homework = new Homework({
        title: will_homework['title'],
        deadline: will_homework['deadline'],
        url: will_homework['url'],
        state: 'running'
    });
    homework.save().then(function (data) {
        setTimeout(function () {
            updateState(data);
        }, getDifferent(data['deadline']));
        cb();
    });
};

function updateState(data) {
    data['state'] = 'finish';
    data.save().then(function (data) {
        console.log(data);
    });
}

function getNow() {
    return moment().format();
}

function getDifferent(deadline) {
    return moment(deadline).diff(moment(getNow()));
}

HomeworkSchema.statics.getHomework = function (cb) {
    this.find().then(function (data) {
        if (data) {
            cb({'succeed': true, 'data': data})
        } else {
            cb({'succeed': false});
        }
    }).catch(function (error) {
        cb({'succeed': false, 'error': error});
    });
};

var Homework = mongoose.model('Homework', HomeworkSchema);

module.exports = Homework;
