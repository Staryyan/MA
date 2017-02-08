/**
 * Created by yanzexin on 03/02/2017.
 * All right reserved @Stary 03/02/2017
 */

var app = angular.module('studentHomeApp', ['angularFileUpload']);

app.controller('studentHomeCtrl', function ($scope, $upload, $http) {
    loadHomework();

    loadScore();

    $scope.init = function (studentId) {
        $scope.studentId = studentId;
    };
    
    $scope.onFileSelect = function ($files) {
        $scope.files = $files;
    };
    
    $scope.willUploadFile = function (homeworkId) {
        $scope.willUploadFileHomeworkId = homeworkId;
    };
    
    $scope.upload = function () {
        if (isEmpty()) {
            $upload.upload({
                url: 'student/uploadHomework',
                data: {
                    studentId: $scope.studentId,
                    homeworkId: $scope.willUploadFileHomeworkId
                },
                file: $scope.files[0],
                method: 'POST'
            }).success(function (data) {
                console.log(data);
                if (data['succeed']) {
                    notify('上传成功!', 'success');
                    uploadLocalScore(data['data']);
                    $('#uploadFiles').modal('hide');
                } else {
                    notify('上传失败!', 'danger');
                }
            }).error(function (error) {
                console.log(error);
            })
        }
    };
    
    function isEmpty() {
        if (!$scope.files) {
            notify('请先选择文件!', 'danger');
            return false;
        } else {
            return true;
        }
    }

    function loadHomework() {
        $http({
            url: '/users/loadHomework',
            method: 'POST'
        }).success(function (data) {
            if (data['succeed']) {
                $scope.homeworkList = data['data'];
                loadScore();
            } else {
                console.log(data['error']);
            }
        }).error(function (error) {
            console.log(error);
            notify('出错了,请联系管理员!', 'danger');
        })
    }

    function loadScore() {
        $http({
            url: '/student/loadScore',
            data: {
                studentId: $scope.studentId
            },
            method: 'POST'
        }).success(function (data) {
            if (data['succeed']) {
                $scope.scoreList = data['data'];
                loadScoreInfo();
            } else {
                console.log(data['error']);
            }
        }).error(function (error) {
            console.log(error);
            notify('出错了!请联系管理员!', 'danger');
        })
    }

    function loadScoreInfo() {
        $http({
            url: 'users/loadScoreInfo',
            method: 'POST'
        }).success(function (data) {
            if (data['succeed']) {
                $scope.scoreInfoList = data['data'];
                computeDataArray();
                computeBar();
            } else {
                console.log(data['error']);
            }
        }).error(function (error) {
            console.log(error);
        })
    }

    $scope.getDownloadUrl = function (homeworkId, homeworkName) {
        var homework = $scope.getScoreById(homeworkId);
        if (homework) {
            return "/student/getFiles?files=" + homework['files'] + "&homeworkName=" + homeworkName;
        }
    };

    $scope.getScoreById = function (homeworkId) {
        if (!$scope.scoreList) {
            return;
        }
        for (var each of $scope.scoreList) {
            if (each['homeworkId'] == homeworkId) {
                return each;
            }
        }
        return null;
    };

    function uploadLocalScore(record) {
        var list = $scope.scoreList;
        for (var each of list) {
            if (each['homeworkId'] == record['homeworkId']) {
                each['files'] = record['files'];
            }
        }
    }

    $scope.convertFormat = function (time) {
        return moment(time).fromNow();
    };

    $scope.getScoreInfoById = function (_id) {
        if (!$scope.scoreInfoList) {
            return;
        }
        for (var per of $scope.scoreInfoList) {
            if (per['homeworkId'] == _id) {
                return per;
            }
        }
        return {
            average: 0,
            max: 0
        };
    };

    function computeDataArray() {
        $scope.homeworkScoreList = [];
        $scope.homeworkAverageList = [];
        $scope.homeworkMaxList = [];
        $scope.homeworkTicksList = [];

        var list = $scope.homeworkList;
        var scoreInfo = {}, score = {};
        var times = 1;
        for (var each of list) {
            if (each['state'] == 'finish') {
                scoreInfo = $scope.getScoreInfoById(each['_id']);
                score = $scope.getScoreById(each['_id']);

                $scope.homeworkScoreList.push([times, score['score']]);
                $scope.homeworkAverageList.push([times, scoreInfo['average']]);
                $scope.homeworkMaxList.push([times, scoreInfo['max']]);
                $scope.homeworkTicksList.push([times, each['title']]);

                times++;
            }
        }
    }


    function computeBar() {
        /* Create an Array push the data + Draw the bars*/

        var barData = new Array();

        barData.push({
            data : $scope.homeworkScoreList,
            label: '你的分数',
            bars : {
                show : true,
                barWidth : 0.08,
                order : 1,
                lineWidth: 0,
                fillColor: '#8BC34A'
            }
        });

        barData.push({
            data : $scope.homeworkAverageList,
            label: '平均分',
            bars : {
                show : true,
                barWidth : 0.08,
                order : 2,
                lineWidth: 0,
                fillColor: '#00BCD4'
            }
        });

        barData.push({
            data : $scope.homeworkMaxList,
            label: '最高分',
            bars : {
                show : true,
                barWidth : 0.08,
                order : 3,
                lineWidth: 0,
                fillColor: '#FF9800'
            }
        });

        /* Let's create the chart */
        if ($('#bar-chart')[0]) {
            $.plot($("#bar-chart"), barData, {
                grid : {
                    borderWidth: 1,
                    borderColor: '#eee',
                    show : true,
                    hoverable : true,
                    clickable : true
                },

                yaxis: {
                    tickColor: '#eee',
                    tickDecimals: 0,
                    min: 0,
                    max: 100,
                    font :{
                        lineHeight: 12,
                        style: "normal",
                        color: "#9f9f9f",
                    },
                    shadowSize: 0
                },

                xaxis: {
                    tickColor: '#fff',
                    tickDecimals: 0,
                    ticks: $scope.homeworkTicksList,
                    font :{
                        lineHeight: 13,
                        style: "normal",
                        color: "#9f9f9f"
                    },
                    shadowSize: 0,
                },

                legend:{
                    container: '.flc-bar',
                    backgroundOpacity: 0.5,
                    noColumns: 0,
                    backgroundColor: "white",
                    lineWidth: 0
                }
            });
        }

        /* Tooltips for Flot Charts */

        if ($(".flot-chart")[0]) {
            $(".flot-chart").bind("plothover", function (event, pos, item) {
                if (item) {
                    var x = item.datapoint[0].toFixed(0),
                        y = item.datapoint[1].toFixed(0);
                    $(".flot-tooltip").html($scope.homeworkTicksList[x - 1][1] + ' : ' + item.series.label + " 为 " + y).css({top: item.pageY+5, left: item.pageX+5}).show();
                }
                else {
                    $(".flot-tooltip").hide();
                }
            });

            $("<div class='flot-tooltip' class='chart-tooltip'></div>").appendTo("body");
        }
    }

});
