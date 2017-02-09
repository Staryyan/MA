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
    data['state'] = 'evaluating';
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

HomeworkSchema.statics.getHomework = function (state, cb) {
    var modal;
    if (state) {
        modal = this.find({state: state});
    } else {
        modal = this.find();
    }
    modal.sort({'_id':1}).then(function (data) {
        if (data) {
            cb({'succeed': true, 'data': data})
        } else {
            cb({'succeed': false});
        }
    }).catch(function (error) {
        cb({'succeed': false, 'error': error});
    });
};

HomeworkSchema.statics.getHomeworkForComment = function (cb) {
    this.find({$or:[{state: 'finish'}, {state: 'evaluating'}]}).then(function (data) {
        if (data) {
            cb({'succeed': true, 'data': data});
        } else {
            cb({'succeed': false});
        }
    }).catch(function (error) {
        console.log(error);
    });
};

HomeworkSchema.statics.afterEvaluate = function (homeworkId) {
    this.findOne({_id: homeworkId}).then(function (record) {
        if (record) {
            console.log(record);
            record['state'] = 'finish';
            record.save();
        }
    }).catch(function (error) {
        console.log(error);
    })
};

HomeworkSchema.statics.getEvaluatingHomeworkList = function (cb) {
    this.find({state: 'evaluating'}).then(function (record) {
        if (record) {
            cb({'succeed': true, 'data': record});
        } else {
            cb({'succeed': false});
        }
    }).catch(function (error) {
        console.log(error);
        cb({'succeed': false, 'error': error});
    });
};

HomeworkSchema.statics.updateHomework = function () {
    this.find().then(function (records) {
        for (var each of records) {
            if (getDifferent(each['deadline']) <= 0 && each['state'] == 'running') {
                each['state'] = 'evaluating';
                each.save();
            } else if (each['state'] == 'running') {
                console.log('update ' + each['_id']);
                setTimeout(function () {
                    updateState(each);
                }, getDifferent(each['deadline']));
            }
        }
    });
};

HomeworkSchema.statics.getHomeworkById = function (_id, cb) {
    this.findOne({'_id': _id}).then(function (record) {
        if (record) {
            cb({'succeed': true, 'data': record});
        } else {
            cb({'succeed': false});
        }
    }).catch(function (error) {
        console.log(error);
        cb({'succeed': false});
    });
};

var Homework = mongoose.model('Homework', HomeworkSchema);

module.exports = Homework;
