/**
 * Created by yanzexin on 09/02/2017.
 * All right reserved @Stary 09/02/2017
 */

$("#data-table-normal").bootgrid({
});

var app = angular.module('studentApp', []);

app.controller('scoresCtrl', function (request, response) {
    
    data_table();
    
    function data_table() {
        $("#data-table-normal").bootgrid({
        });
    }
});