/**
 * Created by yanzexin on 03/02/2017.
 * All right reserved @Stary 03/02/2017
 */
var app = angular.module('profileApp', []);

app.controller('profileCtrl', function ($scope, $http) {
    $scope.save = function () {
        if (this.originalPasswordIsEmpty() && this.newPasswordIsEmpty() && this.reInputIsEmpty()) {
            $http({
                url: '/users/changePassword',
                data: {
                    originalPassword: parsePassword($scope.originalPassword),
                    newPassword: parsePassword($scope.newPassword)
                },
                method: 'POST'
            }).success(function (data) {
                if (data['succeed']) {
                    swal({title: "修改成功!", text: "请重新登录.", type: "success"}, function () {
                        window.location.href = '/logout';
                    });
                }
            }).error(function (error) {
                notify('出错了!请联系管理员!', 'danger');
                console.log(error);
            })
        }
    };

    $scope.originalPasswordIsEmpty = function () {
        var form = $('#originalPasswordForm');
        if (!$scope.originalPassword) {
            form.removeClass('has-success');
            form.addClass('has-warning');
            return false;
        } else {
            form.removeClass('has-warning');
            form.addClass('has-success');
            return true;
        }
    };

    $scope.newPasswordIsEmpty = function () {
        var form = $('#newPasswordForm');
        if (!$scope.newPassword) {
            form.removeClass('has-success');
            form.addClass('has-warning');
            return false;
        } else {
            form.removeClass('has-warning');
            form.addClass('has-success');
            return true;
        }
    };

    $scope.reInputIsEmpty = function () {
        var form = $('#reInputForm');
        if (!$scope.reInput || $scope.reInput != $scope.newPassword) {
            form.removeClass('has-success');
            form.addClass('has-warning');
            return false;
        } else {
            form.removeClass('has-warning');
            form.addClass('has-success');
            return true;
        }
    };

    function parsePassword(password) {
        return hex_md5(password);
    }

});