/**
 * Created by yanzexin on 31/01/2017.
 * All right reserved @Stary 31/01/2017
 */
var fs = require("fs");

var CSVParser = function () {};

var pro = CSVParser.prototype;

pro.computeData = function (filename, callback) {
    pro.readFile(filename, callback);
};

pro.readFile = function (filename, callback) {
    var that = this;
    this.data = [];
    fs.readFile(filename,'utf-8', function(err,fileInfo){
        if(err) {
            console.log("error");
        } else {
            that.parseData(fileInfo);
            callback(that.data);
        }
    });
};

pro.parseData = function (data) {
    data = data.split('\n');
    for (var i = 1; i < data.length; i++) {
        if (data[i] != '') {
            data[i] = data[i].replace(new RegExp("\"","gm"), "");
            data[i] = data[i].replace(/=/, "");
            this.importData(data[i].split(','));
        }
    }
};

pro.importData = function (array) {
    this.data.push({
        "studentId": array[0],
        "name": array[1],
        "email": array[2]
    });
};

module.exports = CSVParser;
