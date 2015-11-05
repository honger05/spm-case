
/**
 *  最佳实践： 生产环境记日志，调试环境让其报错
 *  1. error lifecycle: error --> try-catch --> window.onerror --> Browser Error
 *  2. 被 try-catch 截获了就不会再上送给 window.onerror
 *  3. 被 window.onerror return true 了，就不会再上送给 Browser Error 了。
 */

var debugMode = false;

window.onerror = function(msg, url, line) {
	if (debugMode) {
		return false;
	} else {
		log(2, msg + ' : ' + url + ' : ' + line);
		// true: error cant reach browser
		return true;
	}
};

/**
 * record log
 * @describle production will send error to server
 * @Author    Honger05
 * @DateTime  2015-11-05T10:41:50+0800
 * @param     {[type]}                 severity [1: custom. 2: window.onerror]
 * @param     {[type]}                 message  [description]
 * @return    {[type]}                          [description]
 */
function log(severity, message) {
	var img = new Image();
	img.src = "log.do?sev=" + encodeURIComponent(severity) + "&msg=" + encodeURIComponent(message);
}

/**
 * 生产环境化
 * @describle {{describle}}
 * @Author    Honger05
 * @DateTime  2015-11-05T10:57:33+0800
 * @param     {[type]}                 object [description]
 * @return    {[type]}                        [description]
 */
function productionize(object) {
	var name, method;

	for (name in object) {
		method = object[name];
		if (typeof method === 'function') {
			object[name] = function(name, method) {
				return function() {
					try {
						return method.apply(this, arguments);
					} catch(ex) {
						log(1, name + '(): ' + ex.message);
					}
				};
			}(name, method);
		}
	}
}

var system = {
	fail: function() {
		throw new Error('Oops!');
	}
};

if (!debugMode) {
	productionize(system);
}

system.fail();


try {
	throw new Error('error occur.');
} catch(ex) {
	throw new Error('re-throw the error.');
}