

var _ = require('underscore');

var nr = [1, 2, 3];

// _.each(nr, alert);

// var new_nr = _.map(nr, function(num) {return num * 3});

var sum = _.reduce(nr, function(memo, num) {return memo + num;})



module.exports = _;