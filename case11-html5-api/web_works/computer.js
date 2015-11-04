var i = 0;

function timeCount() {
	for (var j = 0, sum = 0; j < 100000000; j++) {
		for (var i = 0; i < 100000000; i++) {
			sum += 1;
		}
	}

	postMessage(sum);
}

postMessage('before computing, ' + new Date());
timeCount();
postMessage('after computing, ' + new Date());