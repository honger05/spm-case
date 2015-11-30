
var _ = require('underscore');

var nr = [1, 2, 3];

var list = [[0, 1], [2, 3], [4, 5]];

// _.each(nr, alert);

// var new_nr = _.map(nr, function(num) {return num * 3});

// var sum = _.reduce(nr, function(memo, num) {return memo + num;})


var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);



module.exports = _;