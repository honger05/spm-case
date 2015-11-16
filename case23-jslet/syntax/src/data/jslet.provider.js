/* ========================================================================
 * Jslet framework: jslet.provider.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

if (!jslet.data) {
	jslet.data = {};
}

/**
 * @static
 * @private
 * 
 */
jslet.data.ApplyAction = {QUERY: 'query', SAVE: 'save', SELECTED: 'selected'};

/**
 * @class jslet.data.DataProvider
 * 
 * @required
 */
jslet.data.DataProvider = function() {
	
	/**
	 * @param dataset jslet.data.Dataset;
	 * @param url String the request url;
	 * @param reqData String the request data which need to send to server.
	 */
	this.sendRequest = function(dataset, url, reqData) {
		var settings;
		if(jslet.global.beforeSubmit) {
			settings = jslet.global.beforeSubmit({url: url});
		}
		if(!settings) {
			settings = {}
		}
		settings.type = 'POST';
		settings.contentType = 'application/json';
		settings.mimeType = 'application/json';
		settings.dataType = 'json';
		settings.data = reqData;
		settings.context = dataset;
		if(dataset.csrfToken) {
			var headers = settings.headers || {};
			headers.csrfToken = dataset.csrfToken;
			settings.headers = headers;
		}
		
		var defer = jQuery.Deferred();
		jQuery.ajax(url, settings)
		.done(function(data, textStatus, jqXHR) {
			if(data) {
				if(data.csrfToken) {
					this.csrfToken = data.csrfToken;
				}
				var errorCode = data.errorCode;
				if (errorCode) {
					defer.reject(data, this);
					return;
				}
			}
			defer.resolve(data, this);
		})
		.fail(function( jqXHR, textStatus, errorThrown ) {
			var data = jqXHR.responseJSON,
				result;
			if(data && data.errorCode) {
				result = {errorCode: data.errorCode, errorMessage: data.errorMessage};
			} else {
				if(textStatus == 'error') {
					errorCode = '0000';
					errorMessage = jslet.locale.Common.ConnectError;
				}
				result = {errorCode: errorCode, errorMessage: errorMessage};
			}
			defer.reject(result, this);
		})
		.always(function(dataOrJqXHR, textStatus, jqXHRorErrorThrown) {
			if(jQuery.isFunction(dataOrJqXHR.done)) { //fail
				var data = dataOrJqXHR.responseJSON,
					result;
				if(data && data.errorCode) {
					result = {errorCode: data.errorCode, errorMessage: data.errorMessage};
				} else {
					result = {errorCode: textStatus, errorMessage: jqXHRorErrorThrown};
				}
				defer.always(result, this);
			} else {
				defer.always(dataOrJqXHR, this);
			}
		});
		return defer.promise();
	};
};
