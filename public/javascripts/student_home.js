/**
 * Created by yanzexin on 03/02/2017.
 * All right reserved @Stary 03/02/2017
 */
$(document).ready(function(){

    /* Make some random data for Flot Line Chart*/

    var data1 = [[1,60], [2,30], [3,50], [4, 99], [5,10], [6,90], [7,85]];
    var data2 = [[1,20], [2,90], [3,60], [4,40], [5, 99], [6,25], [7,65]];
    var data3 = [[1,99], [2,20], [3,100], [4,90], [5,80], [6,10], [7,5]];

    var ticks = [[1, '作业1'], [2, '作业2'], [3, '作业2'], [4, '作业2'], [5, '作业2'], [6, '作业6'], [7, '作业7']];
    
    /* Create an Array push the data + Draw the bars*/

    var barData = new Array();

    barData.push({
        data : data1,
        label: '你的成绩',
        bars : {
            show : true,
            barWidth : 0.08,
            order : 1,
            lineWidth: 0,
            fillColor: '#8BC34A'
        }
    });

    barData.push({
        data : data2,
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
        data : data3,
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
                ticks: ticks,
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
                $(".flot-tooltip").html(ticks[x - 1][1] + ' : ' + item.series.label + " 为 " + y).css({top: item.pageY+5, left: item.pageX+5}).show();
            }
            else {
                $(".flot-tooltip").hide();
            }
        });

        $("<div class='flot-tooltip' class='chart-tooltip'></div>").appendTo("body");
    }
});