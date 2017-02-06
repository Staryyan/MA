/**
 * Created by yanzexin on 05/02/2017.
 * All right reserved @Stary 05/02/2017
 */

var app = angular.module('adminHomeApp', []);

app.controller('adminHomeCtrl', function ($scope, $http) {
    loadHomework();

    loadScoreInfo();

    function loadHomework() {
        $http({
            url: 'admin/loadHomework',
            method: 'POST'
        }).success(function (data) {
            console.log(data['data']);
            if (data['succeed']) {
                $scope.homeworkList = data['data'];
            } else {
                console.log(data['error']);
            }
        }).error(function (error) {
            console.log(error);
        })
    }

    function loadScoreInfo() {
        $http({
            url: 'admin/loadScoreInfo',
            method: 'POST'
        }).success(function (data) {
            console.log(data);
            if (data['succeed']) {
                $scope.scoreInfoList = data['data'];
            } else {
                console.log(data['error']);
            }
        }).error(function (error) {
            console.log(error);
        })
    }

    $scope.getInfoById = function (_id) {
        for (var per in $scope.scoreInfoList) {
            if (per['homeworkId'] == _id) {
                return per;
            }
        }
        return {
            size: 0,
            average: 0,
            max: 0
        };
    };

    $scope.convertFormat = function (time) {
        return moment(time).fromNow();
    }
});