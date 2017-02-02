/**
 * Created by yanzexin on 02/02/2017.
 * All right reserved @Stary 02/02/2017
 */
$(document).ready(function(){
    //Basic Example
    $("#data-table-basic").bootgrid({
        css: {
            icon: 'zmdi icon',
            iconColumns: 'zmdi-view-module',
            iconDown: 'zmdi-expand-more',
            iconRefresh: 'zmdi-refresh',
            iconUp: 'zmdi-expand-less'
        },
    });

    //Selection
    $("#data-table-selection").bootgrid({
        css: {
            icon: 'zmdi icon',
            iconColumns: 'zmdi-view-module',
            iconDown: 'zmdi-expand-more',
            iconRefresh: 'zmdi-refresh',
            iconUp: 'zmdi-expand-less'
        },
        selection: true,
        multiSelect: true,
        rowSelect: true,
        keepSelection: true
    });

    //Command Buttons
    $("#data-table-command").bootgrid({
        css: {
            icon: 'zmdi icon',
            iconColumns: 'zmdi-view-module',
            iconDown: 'zmdi-expand-more',
            iconRefresh: 'zmdi-refresh',
            iconUp: 'zmdi-expand-less'
        },
        formatters: {
            "commands": function(column, row) {
                return "<button type=\"button\" class=\"btn btn-icon command-edit waves-effect waves-circle\" data-row-id=\"" + row.id + "\"><span class=\"zmdi zmdi-edit\"></span></button> " +
                    "<button type=\"button\" class=\"btn btn-icon command-delete waves-effect waves-circle\" data-row-id=\"" + row.id + "\"><span class=\"zmdi zmdi-delete\"></span></button>";
            }
        }
    });
});


var app = angular.module('adminApp', []);
app.controller('scoresCtrl', function ($scope, $http) {
    init();

    function init() {
        loadTotalScores();
        loadScoreBySelectedScores();
    }

    function loadTotalScores() {
        $scope.totalHomework = ['作业1', '作业2', '作业3'];
        $scope.selectedHomework = $scope.totalHomework[0];
    }

    function loadScoreBySelectedScores() {
        $scope.totalScores = [{
            studentId: '15331348',
            name: '颜泽鑫',
            score: '100'
        }];
    }

});