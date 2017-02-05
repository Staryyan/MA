/**
 * Created by yanzexin on 04/02/2017.
 * All right reserved @Stary 04/02/2017
 */

$(document).ready(function () {
    //Command Buttons
    $("#data-table-command").bootgrid({
        // css: {
        //     icon: 'zmdi icon',
        //     iconColumns: 'zmdi-view-module',
        //     iconDown: 'zmdi-expand-more',
        //     iconRefresh: 'zmdi-refresh',
        //     iconUp: 'zmdi-expand-less'
        // },
        formatters: {
            "commands": function(column, row) {
                var html = "<button type=\"button\" class=\"btn btn-icon command-edit waves-effect waves-circle\" data-row-id=\"" + row.id + "\" onclick=\"trys(" + row.id + ")\"><span class=\"zmdi zmdi-edit\"></span></button> " +
                    "<button type=\"button\" class=\"btn btn-icon command-delete waves-effect waves-circle\" data-row-id=\"" + row.id + "\" onclick=\"trys(" + row.id + ", #{homeworksList})\"><span class=\"zmdi zmdi-download\"></span></button>";
                return html;
            }
        }
    });
});
