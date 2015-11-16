/* ========================================================================
 * Jslet framework: jslet.global.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

if (!jslet.rootUri) {
    var ohead = document.getElementsByTagName('head')[0], 
        uri = ohead.lastChild.src;
    if(uri) {
	    uri = uri.substring(0, uri.lastIndexOf('/') + 1);
	    jslet.rootUri = uri;
    }
}
jslet.global = {
	version: '3.0.0',
	
	//Used in jslet.data.Dataset_applyChanges
	changeStateField: 'rs',
	
	//Used in jslet.data.Dataset_selected
	selectStateField: '_sel_',
	
	//Value separator
	valueSeparator: ',',
	
	defaultRecordClass: null,
	
	defaultFocusKeyCode: 9,
	
	defaultCharWidth: 12,
	
	debugMode: true
};

/**
 * Global server error handler
 * 
 * @param {String} errCode, error code
 * @param {String} errMsg,  error message
 * 
 * @return {Boolean} Identify if handler catch this error, if catched, the rest handler will not process it.
 */
jslet.global.serverErrorHandler = function(errCode, errMsg) {
	return false;
}

/**
 * Global event handler for jQuery.ajax, you can set settings here.
 * 
 * @param {Plan Object} settings jQuery.ajax settings.
 * 
 * @return {Plan Object} jQuery.ajax settings, @see http://api.jquery.com/jQuery.ajax/.
 * 			Attension: 
 * 			the following attributes can not be set: type, contentType, mimeType, dataType, data, context.
 */
jslet.global.beforeSubmit = function(settings) {
	
	return settings;
}


