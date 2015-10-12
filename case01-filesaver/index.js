var filesaver = require('filesaver');
var $ = require('jquery');

$('#download').on('click', function() {
	var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
	filesaver.saveAs(blob, 'hello.txt');
});

console.log(filesaver.saveAs);