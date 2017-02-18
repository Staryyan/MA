/**
 * Created by yanzexin on 08/02/2017.
 * All right reserved @Stary 08/02/2017
 */
$(document).ready(function() {
    $("#data-table-command").bootgrid({
    });
});

var app = angular.module('adminApp', []);

app.controller('viewUsersCtrl', function ($http, $scope) {
    $scope.init = function (status) {
        $scope.status = status;
    };
    
    $scope.deleteAllUsers = function () {
        $http({
            url: 'admin/deleteAllUsers',
            method: 'POST',
            data: {
                status: $scope.status
            }
        }).success(function (data) {
            if (data['succeed']) {
                notify('删除成功!', 'success');
                setTimeout("window.location.href='./admin_home'", 1000);
            } else {
                notify('删除失败!', 'danger');
            }
        }).error(function (error) {
            notify('出错了!请联系管理员!', 'danger');
            console.log(error);
        });
    };
    
    $scope.deleteUsers = function () {
        $http({
            url: 'admin/deleteUsers',
            method: 'POST',
            data: {
                studentId: $scope.studentId,
                status: $scope.status
            }
        }).success(function (data) {
            console.log(data);
            if (data['succeed']) {
                notify('删除成功!', 'success');
                setTimeout("window.location.href='./admin_home'", 1000);
            } else {
                notify('删除失败! ' + data['error'], 'danger');
            }
        }).error(function (error) {
            console.log(error);
            notify('出错了!请联系管理员!', 'danger');
        });
    };
});
