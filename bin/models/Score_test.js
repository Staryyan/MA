/**
 * Created by yanzexin on 04/02/2017.
 * All right reserved @Stary 04/02/2017
 */
var Score = require('./Score');
var ScoreInfo = require('./ScoreInfo');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MA');
var conn = mongoose.connection;
conn.on('error', error => console.log(error));
conn.once('open', info => console.log('Connected!'));

Score.handInHomework({homeworkId: '1', studentId: '15331340', files: '123'}, function (data) {
    console.log(data);
});

Score.handInHomework({homeworkId: '1', studentId: '15331339', files: '123'}, function (data) {
    console.log(data);
});

Score.setScore({homeworkId: '1', studentId: '15331340', score: 80}, function (data) {
    console.log(data);
});

Score.setScore({homeworkId: '1', studentId: '15331339', score: 99}, function (data) {
    console.log(data);
});

ScoreInfo.finishHomework('1', function (data) {
    console.log(data);
});

