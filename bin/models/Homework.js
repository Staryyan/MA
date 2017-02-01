/**
 * Created by yanzexin on 01/02/2017.
 * All right reserved @Stary 01/02/2017
 */
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var HomeworkSchema = new Schema({
    title: String,
    beginTime: String,
    deadline: String
});

HomeworkSchema.statics.publish = function (will_homework, cb) {
    var homework = new Homework({
        title: will_homework['title'],
        beginTime: will_homework['beginTime'],
        deadline: will_homework['deadline']
    });
    homework.save().then(function (data) {
        console.log(data);
        cb();
    });
};

var Homework = mongoose.model('Homework', HomeworkSchema);

module.exports = Homework;
