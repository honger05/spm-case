
/**
 * 当 n === 0 时，返回 0；n === 1时，返回 1;
 * n > 1 时，返回 `fibonacci(n) === fibonacci(n-1) + fibonacci(n-2)`，如 `fibonacci(10) === 55`;
 * n 不可大于10，否则抛错，因为 Node.js 的计算性能没那么强。
 * n 也不可小于 0，否则抛错，因为没意义。
 * n 不为数字时，抛错。
 * @describle {{describle}}
 * @Author    Honger05
 * @DateTime  2015-11-12T14:55:37+0800
 * @param     {[type]}                 n [description]
 * @return    {[type]}                   [description]
 */
var fibonacci = function(n) {
	if (typeof n !== 'number') {
		throw new Error('n should be a Number');
	}
	if (n < 0) {
		throw new Error('n should >= 0');
	}
	if (n > 10) {
		throw new Error('n should <= 10');
	}
	if (n === 0) {
		return 0;
	}
	if (n === 1) {
		return 1;
	}

	return fibonacci(n - 1) + fibonacci(n - 2);
}

exports.fibonacci = fibonacci;

// 如果是直接执行 main.js，则进入此处 eg: node main.js 10
// 如果 main.js 被其他文件 require，则此处不会执行。
if (require.main === module) {
	var n = Number(process.argv[2]);
	console.log('fibonacci(' + n + ') is ', fibonacci(n));
}