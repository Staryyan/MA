/**
 * Created by yanzexin on 02/02/2017.
 * All right reserved @Stary 02/02/2017
 */
var app = angular.module('adminApp', []);
app.controller('scoresCtrl', function ($scope, $http) {
    data_table();

    $scope.init = function (selectedTitle, homeworkList) {
        $scope.selectedTitle = selectedTitle;
        $scope.homeworkList = homeworkList;
    };
    
    $scope.$watch('selectedTitle', function (newValue, oldValue) {
        if (newValue != oldValue) {
            var homework = getHomework(newValue);
            if (homework) {
                window.location.href = '/admin_scores?homeworkId=' +
                    homework['_id'] + ';homeworkTitle=' + homework['title'];
            }
        }
    });

    function getHomework(homeworkName) {
        for (var each of $scope.homeworkList) {
            if (each['title'] == homeworkName) {
                return each;
            }
        }
    }

    function data_table() {
        $("#data-table-command").bootgrid({
        });
    }
});