/**
 * Created by yanzexin on 31/01/2017.
 * All right reserved @Stary 31/01/2017
 */
var app = angular.module('adminApp', ['angularFileUpload']);

app.controller('importUserCtrl', function ($scope, $upload, $http) {
    $scope.status = 'Student';

    $scope.previewData = function () {
        if ($scope.files) {
            upload();
        } else {
            notify('请输入文件!', 'danger');
        }
    };

    $scope.onFileSelect = function ($files) {
        $scope.files = $files;
    };
    
    $scope.submitData = function () {
        if ($scope.files) {
            $http({
                url: '/admin/submitUser',
                data: {
                    userList: $scope.userList,
                    status: $scope.status
                },
                method: 'POST'
            }).success(function (data) {
                if (data['succeed']) {
                    swal({title: "上传成功!", text: "你的数据已经上传成功.", type: "success"}, function () {
                        window.location.href = '../admin_home';
                    });
                } else {
                    notify('上传失败!', 'danger');
                }
            }).error(function (error) {
                notify('上传失败!', 'danger');
                console.log(error);
            })
        } else {
            notify('请先预览上传文件', 'danger');
        }
    };

    function upload() {
        for (var i = 0; i < $scope.files.length; i++) {
            var file = $scope.files[i];
            /*文件上传函数*/
            $scope.upload = $upload.upload({
                url: '/admin/previewUser',
                data: {myObj: $scope.myModelObj},
                file: file
            }).success(function (data) {
                // 文件上传成功处理函数
                $scope.userList = data;
                notify('数据预览成功!');
                console.log($scope.userList);
            }).error(function (error, status, headers, config) {
                //失败处理函数
                console.log('上传失败');

            });
        }
    }
});