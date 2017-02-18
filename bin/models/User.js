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
        if (!data.length) {
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
        each['status'] = status;
        this.register(each, function () {
            total--;
            if (total == 0) {
                cb();
            }
        });
    }
};

UserSchema.statics.changePassword = function (user, cb) {
    this.findUserByStudentId(user.studentId, function (data) {
        console.log(data[0].password);
        console.log(parsePassword(user.originalPassword));
        if (data[0].password == parsePassword(user.originalPassword)) {
            data[0].password = parsePassword(user.newPassword);
            data[0].save().then(function (info) {
                if (info) {
                    cb({'succeed': true});
                } else {
                    cb({'succeed': false});
                }
            }).catch(function (error) {
                cb({'succeed': false, 'error': error});
            });
        } else {
            cb({'succeed': false, 'error': '密码错误!'});
        }
    });
};

UserSchema.statics.findUserByStatus = function (status, cb) {
    this.find({status: status}).then(function (record) {
        if (record) {
            cb({'succeed': true, 'data': record});
        } else {
            cb({'succeed': false, 'data': null});
        }
    }).catch(function (error) {
        console.log(error);
        cb({'succeed': false});
    });
};

UserSchema.statics.deleteAllUsers = function (status, cb) {
    this.remove({status: status}).then(function (data) {
        console.log(data);
        cb({'succeed': true});
    }).catch(function (error) {
        console.log(error);
    });
};

UserSchema.statics.deleteUserById = function (studentId, status, cb) {
    var that = this;
    this.findOne()
        .where({studentId: studentId})
        .then(function (data) {
            if (data) {
                that.remove()
                    .where({studentId: studentId})
                    .then(function () {
                        cb({'succeed': true});
                    }).catch(function (error) {
                    cb({'succeed': false});
                    console.log(error);
                });
            } else {
                cb({'succeed': false, 'error': '用户不存在!'});
            }
    }).catch(function (error) {
        console.log(error);
        cb({'succeed': false});
    });
};

UserSchema.statics.findAllUsers = function (cb) {
    this.find().then(function (data) {
        cb({'succeed': true, 'data': data});
    }).catch(function (error) {
        console.log(error);
        cb({'succeed': false});
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
