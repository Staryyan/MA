/**
 * Created by yanzexin on 02/02/2017.
 * All right reserved @Stary 02/02/2017
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var User = require('./models/User');

function parsePassword(password) {
    return crypto.createHash('md5').update(password).digest('hex').toLowerCase();
}

mongoose.connect('mongodb://localhost/MA');
var conn = mongoose.connection;
conn.on('error', error => console.log(error));
conn.on('open', info => console.log('MongoDB Connected!'));


User.register({studentId: '15331348', name: 'admin', email: 'yzx9610@outlook.com', status: 'admin'}, function (data) {
    // console.log(data);
    mongoose.disconnect();
});
