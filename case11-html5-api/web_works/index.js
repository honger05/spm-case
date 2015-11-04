/**
 * 开启一个工作线程 
 * @type {Worker}
 */
var worker = new Worker('computer.js');
var resultEl = document.getElementById('result');


worker.onmessage = function(ev) {
	resultEl.innerHTML += ev.data + '<br>';
};