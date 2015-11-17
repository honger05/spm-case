
function Interpreter(tpl) {
	this.tpl = tpl;
}

Interpreter.prototype.parse = function() {
	var i = 0, tpl = this.tpl, len = tpl.controls.length;
	var rootEl = document.getElementById(tpl.root);
	for (; i < len; i++) {
		jslet.ui.createControl(tpl.controls[i], rootEl);
	}	
}

module.exports = Interpreter;




