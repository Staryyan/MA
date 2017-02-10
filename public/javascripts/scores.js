/**
 * Created by yanzexin on 02/02/2017.
 * All right reserved @Stary 02/02/2017
 */
var app = angular.module('App', []);
app.controller('scoresCtrl', function ($scope, $http) {
    data_table();
    
    $scope.init = function (selectedTitle, homeworkList, scoreList) {
        $scope.selectedTitle = selectedTitle;
        $scope.homeworkList = homeworkList;
        $scope.scoreList = JSON.parse(scoreList);
        compuetBar();
    };
    
    $scope.$watch('selectedTitle', function (newValue, oldValue) {
        if (newValue != oldValue) {
            var homework = getHomework(newValue);
            if (homework) {
                window.location.href = '/scores?homeworkId=' +
                    homework['_id'] + '&homeworkTitle=' + homework['title'];
            }
        }
    });
    
    function getHomework(homeworkName) {
        $scope.homeworkList = JSON.parse($scope.homeworkList);
        for (var each of $scope.homeworkList) {
            if (each['title'] == homeworkName) {
                return each;
            }
        }
    }

    function data_table() {
        $("#data-table-command").bootgrid({
        });
    }
    
    $scope.getDownloadUrl = function () {
        return '/downloadScore?homeworkId' + getHomework($scope.selectedHomeworkTitle)['_id'];
    };

    function computeData() {
        $scope._9To_10 = 0;
        $scope._8To_9 = 0;
        $scope._7To_8 = 0;
        $scope._6To_7 = 0;
        $scope.other = 0;
        for (var each of $scope.scoreList) {
            if (each['score'] >= 90) {
                $scope._9To_10++;
            } else if (each['score'] >= 80) {
                $scope._8To_9++;
            } else if (each['score'] >= 70) {
                $scope._7To_8++;
            } else if (each['score'] >= 60) {
                $scope._6To_7++;
            } else {
                $scope.other++;
            }
        }
    }

    function compuetBar() {
        computeData();
        var pieData = [
            {data: $scope._9To_10, color: '#F44336', label: '90-100'},
            {data: $scope._8To_9, color: '#03A9F4', label: '80-89'},
            {data: $scope._7To_8, color: '#8BC34A', label: '70-79'},
            {data: $scope._6To_7, color: '#FFEB3B', label: '60-69'},
            {data: $scope.other, color: '#009688', label: '0-60'}
        ];

        /* Pie Chart */

        if($('#pie-chart')[0]){
            $.plot('#pie-chart', pieData, {
                series: {
                    pie: {
                        show: true,
                        stroke: {
                            width: 2,
                        },
                    },
                },
                legend: {
                    container: '.flc-pie',
                    backgroundOpacity: 0.5,
                    noColumns: 0,
                    backgroundColor: "white",
                    lineWidth: 0
                },
                grid: {
                    hoverable: true,
                    clickable: true
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                    shifts: {
                        x: 20,
                        y: 0
                    },
                    defaultTheme: false,
                    cssClass: 'flot-tooltip'
                }

            });
        }

        /* Donut Chart */

        if($('#donut-chart')[0]){
            $.plot('#donut-chart', pieData, {
                series: {
                    pie: {
                        innerRadius: 0.5,
                        show: true,
                        stroke: {
                            width: 2,
                        },
                    },
                },
                legend: {
                    container: '.flc-donut',
                    backgroundOpacity: 0.5,
                    noColumns: 0,
                    backgroundColor: "white",
                    lineWidth: 0
                },
                grid: {
                    hoverable: true,
                    clickable: true
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                    shifts: {
                        x: 20,
                        y: 0
                    },
                    defaultTheme: false,
                    cssClass: 'flot-tooltip'
                }

            });
        }  
    }
    
});