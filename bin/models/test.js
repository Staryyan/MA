/**
 * Created by yanzexin on 03/02/2017.
 * All right reserved @Stary 03/02/2017
 */
var _ = require('underscore');

var array = [{'score': 100}, {'score': 200}];
var scores = _.pluck(array, 'score');
var times = 0;
var averageScore = 0;
_.each(scores, function (num) {
    averageScore += num;
    times++;
});
averageScore /= times;
console.log(averageScore);
console.log(_.max(scores));