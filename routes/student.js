/**
 * Created by yanzexin on 05/02/2017.
 * All right reserved @Stary 05/02/2017
 */

var express = require('express');
var router = express.Router();
var formidable = require('formidable');


router.post('/uploadFile', function (response, request) {
    console.log('uploadFile');
    var form = formidable.IncomingForm();
    form._encoding = 'utf-8';
    form.uploadDir = 'homework/';
    form.keepExtensions = true;
    form.hash = false;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.maxFileSize = 1;
    form.parse(request, function (err, field, files) {
        if (err) {
            response.render('error');
        } else {
            var path = '';
            if (files['file']['size'] != 0) {
                path = files['file']['path'].toString();
            }
            var parser = new Parser();
            parser.computeData(path, function (data) {
                response.json(data);
            });
        }
    });
});

module.exports = router;
