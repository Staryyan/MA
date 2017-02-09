/**
 * Created by yanzexin on 09/02/2017.
 * All right reserved @Stary 09/02/2017
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HomeworkStaticsSchema = new Schema({
    homeworkId: String,
    file: String
});

HomeworkStaticsSchema.statics.createStaticsFile = function (homworkId, fileName, cb) {
    var homeworkStatics = new HomeworkStatics({
        homeworkId: homworkId,
        file: fileName
    });
    homeworkStatics.save().then(function (data) {
        console.log(data);
    })
};

HomeworkStaticsSchema.statics.getFileName = function (homeworkId, cb) {
    this.findOne({homeworkId: homeworkId}).then(function (record) {
        console.log(record);
        if (record) {
            cb({'succeed': true, 'data': record});
        } else {
            cb({'succeed': false});
        }
    }).catch(function (error) {
        console.log(error);
    })
};

var HomeworkStatics = mongoose.model('HomeworkStatics', HomeworkStaticsSchema);

module.exports = HomeworkStatics;
