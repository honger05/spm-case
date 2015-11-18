
require('./panel.css');

// Hack: maybe exist more good method
function Interpreter(tpl) {
	this.tpl = tpl;
}

Interpreter.prototype.parse = function() {
	var i = 0, tpl = this.tpl, len = tpl.controls.length;

	var rootEl = tpl.root ? document.getElementById(tpl.root) : document.body;

	for (; i < len; i++) {
		var control = tpl.controls[i];
		
		createPanel(control.panel, rootEl);
		
		jslet.ui.bindControl(document.getElementById(control.el), control.jsletParams);
	}	

}

function createPanel(panel, rootEl) {
	var source = require('./panel.handlebars');
	var result = source(panel);
	var fragment = document.createDocumentFragment();
	var div = document.createElement('div');
	div.innerHTML = result;
	rootEl.appendChild(div.firstChild);
}
 
module.exports = Interpreter;




