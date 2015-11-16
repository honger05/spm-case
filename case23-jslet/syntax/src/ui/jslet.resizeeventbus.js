/* ========================================================================
 * Jslet framework: jslet.resizeeventbus.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
* Resize event bus, manage all resize event. Example:
* <pre><code>
*	var myCtrlObj = {
*		checkSizeChanged: function(){
*			;
*		}
*	}
*	
*	//Subcribe a message from MessageBus
*	jslet.messageBus.subcribe(myCtrlObj);
*   
*	//Unsubcribe a message from MessageBus
*	jslet.messageBus.unsubcribe(myCtrlObj);
* 
*	//Send a mesasge to MessageBus
*	jslet.messageBus.sendMessage('MyMessage', {x: 10, y:10});
* 
* </code></pre>
* 
*/
jslet.ResizeEventBus = function () {
	
	var handler = null;
	/**
	 * Send a message.
	 * 
	 * @param {Html Element} sender Sender which send resize event.
	 */
	this.resize = function (sender) {
		if (handler){
			window.clearTimeout(handler);
		}
		handler = setTimeout(function(){
			var ctrls, ctrl, jsletCtrl;
			if (sender) {
				ctrls = jQuery(sender).find("*[data-jslet-resizable]");
			} else {
				ctrls = jQuery("*[data-jslet-resizable]");
			}
			if(jslet.ui._activePopup) {
				jslet.ui._activePopup.hide();
			}
			for(var i = 0, cnt = ctrls.length; i < cnt; i++){
				ctrl = ctrls[i];
				if (ctrl){
					jsletCtrl = ctrl.jslet;
					if (jsletCtrl && jsletCtrl.checkSizeChanged){
						jsletCtrl.checkSizeChanged();
					}
				}
			}
			handler = null;
		}, 100);
	};

	/**
	 * Subscribe a control to response a resize event.
	 * 
	 * @param {Object} ctrlObj control object which need subscribe a message, 
	 *	there must be a function: checkSizeChanged in ctrlObj.
	 *	checkSizeChanged: function(){}
	 */
	this.subscribe = function(ctrlObj){
		if (!ctrlObj || !ctrlObj.el) {
			throw new Error("ctrlObj required!");
		}
		jQuery(ctrlObj.el).attr(jslet.ResizeEventBus.RESIZABLE, true);
	};
	
	/**
	 * Unsubscribe a control to response a resize event.
	 * 
	 * @param {Object} ctrlObj control object which need subscribe a message.
	 */
	this.unsubscribe = function(ctrlObj){
		if (!ctrlObj || !ctrlObj.el) {
			throw new Error("ctrlObj required!");
		}
		jQuery(ctrlObj.el).removeAttr(jslet.ResizeEventBus.RESIZABLE);
	};
	
};

jslet.ResizeEventBus.RESIZABLE = "data-jslet-resizable";

jslet.resizeEventBus = new jslet.ResizeEventBus();

jQuery(window).on("resize",function(){
	jslet.resizeEventBus.resize();
});
