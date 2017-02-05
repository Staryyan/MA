/**
 * Created by yanzexin on 02/02/2017.
 * All right reserved @Stary 02/02/2017
 */
var app = angular.module('adminApp', []);
app.controller('scoresCtrl', function ($scope, $http) {
    init();

    function init() {
        loadTotalScores();
        loadScoreBySelectedScores();
    }

    function loadTotalScores() {
        $scope.totalHomework = ['作业1', '作业2', '作业3'];
        $scope.selectedHomework = $scope.totalHomework[0];
    }

    function loadScoreBySelectedScores() {
        $scope.totalScores = [{
            studentId: '15331348',
            name: '颜泽鑫',
            score: '100'
        }];
    }

});