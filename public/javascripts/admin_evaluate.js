/**
 * Created by yanzexin on 10/02/2017.
 * All right reserved @Stary 10/02/2017
 */
/**
 * Created by yanzexin on 04/02/2017.
 * All right reserved @Stary 04/02/2017
 */

var app = angular.module('adminApp', []);

app.controller('evaluateCtrl', function ($scope, $http, $location) {

    loadEvaluateHomeworkList();

    function loadEvaluateHomeworkList() {
        $http({
            url: 'admin/evaluateHomeworkList',
            method: 'POST'
        }).success(function (data) {
            if (data['succeed']) {
                if (data['data']) {
                    notify('作业加载成功!', 'success');
                    console.log(data['data']);
                    $scope.evaluateHomeworkList = data['data'];
                    $scope.selectedHomeworkTitle = data['data'][0]['title'];
                    loadTAList();
                    loadAllHomeworkList();
                } else {
                    notify('没有作业需要评测!', 'warn');
                }
            } else {
                notify('出错了!请联系管理员!', 'danger');
            }
        }).error(function (error) {
            console.log(error);
            notify('出错了!请联系管理员!', 'danger');
        })
    }

    function loadTAList() {
        $http({
            url: 'users/TAList',
            method: 'POST'
        }).success(function (data) {
            if (data['succeed']) {
                $scope.TAList = data['data'];
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    function loadAllHomeworkList() {
        $scope.allHomeworkList = [];
        var list = $scope.evaluateHomeworkList;
        for (var each of list) {
            $http({
                url: 'admin/homeworkList',
                data: {
                    homeworkId: each['_id']
                },
                method: 'POST'
            }).success(function (data) {
                if (data['succeed']) {
                    if (data['data']) {
                        $scope.allHomeworkList.push(data['data']);
                    }
                }
                if (each == list[list.length - 1]) {
                    getLocalHomeworkList();
                }
            }).error(function (error) {
                console.log(error);
                notify('出错了!请联系管理员!', 'danger');
            })
        }
    }

    $scope.getDownloadUrl = function (studentId, filePath) {
        return "/TA/getFiles?files=" + filePath
            + "&studentId=" + studentId;
    };

    function getLocalHomeworkList() {
        getSelectedHomeworkId();
        for (var each of $scope.allHomeworkList) {
            if (each[0]['homeworkId'] == $scope.selectedHomeworkId) {
                $scope.localHomeworkList = each;
                console.log($scope.localHomeworkList);
            }
        }
    }

    $scope.$watch('selectedHomeworkTitle', function (newValue, oldValue) {
        if (newValue != oldValue) {
            getLocalHomeworkList();
        }
    });

    function getSelectedHomeworkId() {
        for (var each of $scope.evaluateHomeworkList) {
            if (each['title'] == $scope.selectedHomeworkTitle) {
                $scope.selectedHomeworkId = each['_id'];
            }
        }
    }

    $scope.setScore = function (_id, $event) {
        for (var each of $scope.localHomeworkList) {
            if (each['_id'] == _id) {
                each['score'] = $event.target.value;
                break;
            }
        }
    };

    $scope.setComment = function (_id, $event) {
        for (var each of $scope.localHomeworkList) {
            if (each['_id'] == _id) {
                each['comment'] = $event.target.value;
                break;
            }
        }
    };

    $scope.saveEvaluate = function (_id) {
        for (var each of $scope.localHomeworkList) {
            if (each['_id'] == _id) {
                $http({
                    url: 'TA/saveEvaluate',
                    data: {
                        score: each
                    },
                    method: 'POST'
                }).success(function (data) {
                    if (data['succeed']) {
                        notify('评测成功!', 'success');
                    } else {
                        notify('评测失败!请重试!', 'danger');
                    }
                }).error(function (error) {
                    notify('出错了! 请联系管理员!', 'danger');
                    console.log(error);
                })
            }
        }
    };

    $scope.finish = function () {
        if (!hasEmpty()) {
            $http({
                url: 'admin/finishEvaluating',
                data: {
                    homeworkId: $scope.selectedHomeworkId
                },
                method: 'POST'
            }).success(function (data) {
                if (data['succeed']) {
                    notify('成功评测完所有作业!', 'success');
                    setTimeout('window.location.href="./scores";', 1000);
                }
            }).error(function (error) {
                notify('出错了!请联系管理员!', 'danger');
                console.log(error);
            })
        }
    };

    $scope.getTAName = function (TAId) {
        for (var each of $scope.TAList) {
            if (each['studentId'] == TAId) {
                return each['name'];
            }
        }
    };

    function hasEmpty() {
        for (var each of $scope.localHomeworkList) {
            if (!each['score'] || !each['comment']) {
                notify('有作业还没有评测,或则还没有给出分数或评论!', 'danger');
                return true;
            }
        }
        return false;
    }

    $scope.recheck = function () {
    };

});

function keyPress(value) {
    var keyCode = event.keyCode;
    if (!(value && value == 0) && (keyCode >= 48 && keyCode <= 57)) {
        if (parseInt(value) > 10) {
            event.returnValue = false;
        } else event.returnValue = !(parseInt(value) == '10' && keyCode != 48);
    } else {
        event.returnValue = false;
    }
}
