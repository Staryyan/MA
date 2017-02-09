/**
 * Created by yanzexin on 09/02/2017.
 * All right reserved @Stary 09/02/2017
 */

var app = angular.module('studentApp', []);

app.controller('commentCtrl', function ($scope, $http) {
    $scope.init = function (studentId) {
        $scope.studentId = studentId;
        loadHomeworkList();
    };
    
    function loadHomeworkList() {
        $http({
            url: 'student/loadHomeworkList',
            method: 'POST'
        }).success(function (data) {
            if (data['succeed']) {
                $scope.homeworkList = data['data'];
                loadScoreList();
            }
        }).error(function (error) {
            console.log(error);
        })
    }
    
    function loadScoreList() {
        $http({
            url: 'student/loadScoreList',
            data: {
                studentId: $scope.studentId
            },
            method: 'POST'
        }).success(function (data) {
            if (data['succeed']) {
                $scope.homeworkScoreList = data['data'];
            }
        }).error(function (error) {
            console.log(error);
        })
    }

    $scope.getScore = function (_id, state) {
        for (var each of $scope.homeworkScoreList) {
            if (each['homeworkId'] == _id) {
                return each;
            }
        }
        if (state == 'evaluating') {
            return {
                comment: '还没有进行评论!',
                score: 0
            }   
        } else {
            return {
                comment: '你没有提交作业!',
                score: 0
            }
        }
    }
    
});
