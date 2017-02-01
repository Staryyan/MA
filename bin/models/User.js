/**
 * Created by yanzexin on 31/01/2017.
 * All right reserved @Stary 31/01/2017
 */
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

function parsePassword(password) {
    return crypto.createHash('md5').update(password).digest('hex').toLowerCase();
}

var UserSchema = Schema({
    studentId: String,
    name: String,
    password: String,
    email: String,
    status: String
});

UserSchema.statics.logInCheck = function (studentId, password, cb) {
    console.log(parsePassword(password));
    this.find({studentId: studentId, password: parsePassword(password)}, cb).catch(function (error) {
        console.log(error);
    });
};

UserSchema.statics.register = function (new_user, cb) {
    var user = new User({
        studentId: new_user.studentId,
        name: new_user.name,
        password: parsePassword(new_user.password)
    });
    user.save().then(cb);
};

UserSchema.statics.importUserList = function (userList, status, cb) {
    var total = userList.length;
    for (var each of userList) {
        var user = new User({
            studentId: each['studentId'],
            name: each['name'],
            password: parsePassword(each['studentId']),
            email: each['email'],
            status: status
        });
        user.save().then(function () {
            total--;
            if (total == 0) {
                cb();
            }
        }).catch(function (error) {
            cb(error);
        });
    }
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
