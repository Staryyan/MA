/**
 * Created by yanzexin on 01/02/2017.
 * All right reserved @Stary 01/02/2017
 */
var app = angular.module('teacherApp', []);

app.controller('publishHomeworkCtrl', function ($scope, $http) {
    $scope.submit = function () {
        if (!formIsEmpty()) {
            $http({
                url: '/teacher/publishHomework',
                data: {
                    title: $scope.description,
                    deadline: getDeadline(),
                    url: $scope.url
                },
                method: 'POST'
            }).success(function (data) {
                console.log(data);
                if (data['succeed']) {
                    swal({title: "发布成功!", text: "作业已经发布成功.", type: "success"}, function () {
                        window.location.href = '../teacher_home';
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
        if (!$scope.description) {
            notify('作业题目不能为空!', 'danger');
            return true;
        }
        if (!$scope.url) {
            notify('作业链接不能为空!', 'danger');
            return true;
        }
        if (!$('#deadline').val()) {
            notify('结束时间都不能为空!', 'danger');
            return true;
        }
        if (getNow() >= getDeadline()) {
            notify('结束时间必须晚于现在', 'danger');
            return true;
        }
        return false;
    }

    function getDeadline() {
        return moment($('#deadline').val(), 'MM/DD/YYYY, h:mm:ss a').format();
    }

    function getNow() {
        return moment().format();
    }
});