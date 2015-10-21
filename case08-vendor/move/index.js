var move = require('move');

move('.box')
	.to(500, 200)
	.rotate(180)
	.scale(.5)
	.set('background-color', 'red')
	.duration('2s')
	.skew(50, -10)
	.then()
		.set('opacity', 0)
		.duration('3s')
		.scale(0.1)
		.pop()
	.end();