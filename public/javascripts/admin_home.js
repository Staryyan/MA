/**
 * Created by yanzexin on 18/02/2017.
 * All right reserved @Stary 18/02/2017
 */
var app = angular.module('adminApp', []);

app.controller('homeCtrl', function ($scope, $http) {

    loadUserList();

    function loadUserList() {
        $http({
            url: 'admin/loadUserList',
            method: 'POST'
        }).success(function (data) {
            if (data['succeed']) {
                computeData(data['data']);
                computeBar();
            }
        }).error(function (error) {
            console.log(error);
        });
    }

    function computeData(array) {
        $scope.studentSize = 0;
        $scope.TASize = 0;
        $scope.teacherSize = 0;
        for (var each of array) {
            if (each.status == 'Student') {
                $scope.studentSize++;
            } else if (each.status == 'teacher') {
                $scope.teacherSize++;
            } else {
                $scope.TASize++;
            }
        }
    }

    function computeBar() {
        /* Create an Array push the data + Draw the bars*/

        var barData = new Array();

        barData.push({
            data : [[1, $scope.teacherSize]],
            label: '教师',
            bars : {
                show : true,
                barWidth : 0.08,
                order : 1,
                lineWidth: 0,
                fillColor: '#8BC34A'
            }
        });

        barData.push({
            data : [[1, $scope.TASize]],
            label: '助教',
            bars : {
                show : true,
                barWidth : 0.08,
                order : 2,
                lineWidth: 0,
                fillColor: '#00BCD4'
            }
        });

        barData.push({
            data : [[1, $scope.studentSize]],
            label: '学生',
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
                    ticks: [[1, '']],
                    font :{
                        lineHeight: 13,
                        style: "normal",
                        color: "#9f9f9f"
                    },
                    shadowSize: 0
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
                    $(".flot-tooltip").html(item.series.label + "为" + y + '人').css({top: item.pageY+5, left: item.pageX+5}).show();
                }
                else {
                    $(".flot-tooltip").hide();
                }
            });

            $("<div class='flot-tooltip' class='chart-tooltip'></div>").appendTo("body");
        }
    }
});