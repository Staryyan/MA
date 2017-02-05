/**
 * Created by yanzexin on 05/02/2017.
 * All right reserved @Stary 05/02/2017
 */

var Homework = require('./Homework');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MA');

Homework.publish({
    title: 'test',
    deadline: '2017-02-05T16:42:11+08:00',
    url: 'tttt',
    state: 'running'
}, function (data) {
    console.log(data);
});


