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

UserSchema.statics.logInCheck = function (user, cb) {
    this.findUserByStudentId(user.studentId, function (data) {
        if (!data) {
            cb({'succeed': false, 'error': '用户不存在.'});
        } else {
            if (data[0]['password'] == parsePassword(user.password)) {
                cb({'succeed': true}, data);
            } else {
                cb({'succeed': false, 'error': '密码错误.'});
            }
        }
    });
};
UserSchema.statics.register = function (new_user, cb) {
    this.findUserByStudentId(new_user.studentId, function (data) {
        if (!data.length) {
            var user = new User({
                studentId: new_user.studentId,
                name: new_user.name,
                password: parsePassword(parsePassword(new_user.studentId)),
                email: new_user.email,
                status: new_user.status
            });
            user.save().then(cb);
        } else {
            cb();
        }
    });
};

UserSchema.statics.findUserByStudentId = function (studentId, cb) {
    this.find({studentId: studentId}).then(function (data) {
        cb(data);
    }).catch(function (error) {
        console.log(error);
    });
};

UserSchema.statics.importUserList = function (userList, status, cb) {
    var total = userList.length;
    for (var each of userList) {
        var user = new User({
            studentId: each['studentId'],
            name: each['name'],
            password: parsePassword(parsePassword(each['studentId'])),
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
