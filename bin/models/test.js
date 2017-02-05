/**
 * Created by yanzexin on 03/02/2017.
 * All right reserved @Stary 03/02/2017
 */

var moment = require('moment');

timeOut();

function timeOut() {
    console.log(getNow());
    console.log(getNow());
    console.log(different(getNow(), getTime()));
    setTimeout(test, different(getNow(), getTime()));
}

function test() {
    console.log('test()');
}

function getNow() {
    return moment().format();
}

function getTime() {
    return moment('2017-02-05T16:43:11+08:00').format();
}

function different(time1, time2) {
    return moment(time2).diff(moment(time1));
}