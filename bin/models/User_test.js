/**
 * Created by yanzexin on 01/02/2017.
 * All right reserved @Stary 01/02/2017
 */
var User = require('./User');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MA');
var conn = mongoose.connection;
conn.on('error', error => console.log(error));
conn.once('open', info => console.log('Connected!'));

var array = [ { studentId: '15331348',
    name: '颜泽鑫',
    email: 'yzx9610@outlook.com' },
    { studentId: '15331349', name: '邓夏君', email: '718202260@qq.com' },
    { studentId: '15331348',
        name: '颜泽鑫',
        email: 'yzx9610@outlook.com' },
    { studentId: '15331349', name: '邓夏君', email: '718202260@qq.com' },
    { studentId: '15331348',
        name: '颜泽鑫',
        email: 'yzx9610@outlook.com' },
    { studentId: '15331349', name: '邓夏君', email: '718202260@qq.com' },
    { studentId: '15331348',
        name: '颜泽鑫',
        email: 'yzx9610@outlook.com' },
    { studentId: '15331349', name: '邓夏君', email: '718202260@qq.com' } ];
User.importUserList(array, 'student', function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log('nice');
    }
});