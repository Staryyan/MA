/**
 * Created by yanzexin on 05/02/2017.
 * All right reserved @Stary 05/02/2017
 */


var app = angular.module('adminHomeApp', []);

app.controller('adminHomeCtrl', function ($scope, $http) {
    loadHomework();

    function loadHomework() {
        $http({
            url: 'users/loadHomework',
            method: 'POST'
        }).success(function (data) {
            if (data['succeed']) {
                $scope.homeworkList = data['data'];
                loadScoreInfo();
            } else {
                console.log(data['error']);
            }
        }).error(function (error) {
            console.log(error);
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

    $scope.getInfoById = function (_id) {
        if (!$scope.scoreInfoList) {
            return;
        }
        for (var per of $scope.scoreInfoList) {
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
    };

    function computeDataArray() {
        $scope.homeworkSizeList = [];
        $scope.homeworkAverageList = [];
        $scope.homeworkMaxList = [];
        $scope.homeworkTicksList = [];

        var list = $scope.homeworkList;
        var scoreInfo = {};
        var times = 1;
        for (var each of list) {
            if (each['state'] == 'finish') {

                scoreInfo = $scope.getInfoById(each['_id']);
                $scope.homeworkSizeList.push([times, scoreInfo['size']]);
                $scope.homeworkAverageList.push([times, scoreInfo['average']]);
                $scope.homeworkMaxList.push([times, scoreInfo['max']]);
                $scope.homeworkTicksList.push([times, each['title']]);
                times++;
            }
        }
    }

    function computeBar() {
        /* Create an Array push the data + Draw the bars*/

        console.log($scope.homeworkTicksList);
        var barData = new Array();

        barData.push({
            data : $scope.homeworkSizeList,
            label: '提交次数',
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