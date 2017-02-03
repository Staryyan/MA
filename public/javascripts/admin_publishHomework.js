/**
 * Created by yanzexin on 01/02/2017.
 * All right reserved @Stary 01/02/2017
 */
var app = angular.module('adminApp', []);

app.controller('publishHomeworkCtrl', function ($scope, $http) {
    $scope.submit = function () {
        if (!formIsEmpty()) {
            $http({
                url: '/admin/publishHomework',
                data: {
                    title: $scope.description,
                    beginTime: $('#beginTime').val(),
                    deadline: $('#deadline').val(),
                    url: $scope.url
                },
                method: 'POST'
            }).success(function (data) {
                console.log(data);
                if (data['succeed']) {
                    swal({title: "发布成功!", text: "作业已经发布成功.", type: "success"}, function () {
                        window.location.href = '../admin_home';
                    });
                } else {
                    notify('作业发布失败!', 'danger');
                    console.log(data['error']);
                }
            }).error(function (error) {
                notify('作业发布失败!', 'danger');
                console.log(data['error']);
            })
        }
    };

    function formIsEmpty() {
        console.log('test');
        if (!$scope.description) {
            notify('作业题目不能为空!', 'danger');
            return true;
        }
        if (!$scope.url) {
            notify('作业链接不能为空!', 'danger');
            return true;
        }
        if (!$('#beginTime').val() || !$('#deadline').val()) {
            notify('开始时间和结束时间都不能为空!', 'danger');
            return true;
        }
        console.log($('#beginTime').val());
        console.log($('#deadline').val());
        if ($('#beginTime').val() >= $('#deadline').val()) {
            notify('结束时间必须晚于开始时间', 'danger');
            return true;
        }
        return false;
    }
});