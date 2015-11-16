/* ========================================================================
 * Jslet framework: jslet.messagebus.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
* Message bus. Example:
* <pre><code>
*	var myCtrlObj = {
*		onReceiveMessage: function(messageName, messageBody){
*			alert(messageBody.x);
*		}
*	}
* 
*   //Subcribe a message from MessageBus
*   jslet.messageBus.subcribe('MyMessage', myCtrlObj);
*   
*   //Unsubcribe a message from MessageBus
*	jslet.messageBus.unsubcribe('MyMessage', myCtrlObj);
*	
*	//Send a mesasge to MessageBus
*	jslet.messageBus.sendMessage('MyMessage', {x: 10, y:10});
* 
* </code></pre>
* 
*/
jslet.MessageBus = function () {
	var _messages = {};
	//SizeChanged is predefined message
	_messages[jslet.MessageBus.SIZECHANGED] = [];
	
	var _timeoutHandlers = [];
	/**
	 * Send a message.
	 * 
	 * @param {String} messageName Message name.
	 * @param {Object} mesageBody Message body.
	 */
	this.sendMessage = function (messageName, messageBody, sender) {
		if(!_messages[messageName]) {
			return;
		}
		var handler = _timeoutHandlers[messageName];
		
		if (handler){
			window.clearTimeout(handler);
		}
		handler = setTimeout(function(){
			_timeoutHandlers[messageName] = null;
			var ctrls = _messages[messageName], ctrl;
			for(var i = 0, cnt = ctrls.length; i < cnt; i++){
				ctrl = ctrls[i];
				if (ctrl && ctrl.onReceiveMessage){
					ctrl.onReceiveMessage(messageName, messageBody);
				}
			}
		}, 30);
		_timeoutHandlers[messageName] = handler;
	};

	/**
	* Subscribe a message.
	* 
	* @param {String} messageName message name.
	* @param {Object} ctrlObj control object which need subscribe a message, 
	*   there must be a function: onReceiveMessage in ctrlObj.
	*	onReceiveMessage: function(messageName, messageBody){}
	*   //messageName: String, message name;
	*   //messageBody: Object, message body;
	*/
	this.subscribe = function(messageName, ctrlObj){
		if (!messageName || !ctrlObj) {
			throw new Error("MessageName and ctrlObj required!");
		}
		var ctrls = _messages[messageName];
		if (!ctrls){
			ctrls = [];
			_messages[messageName] = ctrls;
		}
		ctrls.push(ctrlObj);
	};
	
	/**
	 * Subscribe a message.
	 * 
	 * @param {String} messageName message name.
	 * @param {Object} ctrlObj control object which need subscribe a message.
	 */
	this.unsubscribe = function(messageName, ctrlObj){
		var ctrls = _messages[messageName];
		if (!ctrls) {
			return;
		}
		var k = ctrls.indexOf(ctrlObj);
		if (k >= 0) {
			ctrls.splice(k,1);
		}
	};
};

jslet.MessageBus.SIZECHANGED = "SIZECHANGED";

jslet.messageBus = new jslet.MessageBus();

jQuery(window).on("resize",function(){
	jslet.messageBus.sendMessage(jslet.MessageBus.SIZECHANGED, null, window);
});
