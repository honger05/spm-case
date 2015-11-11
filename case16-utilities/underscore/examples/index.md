
# 源码解析
-----

## 集合 （Collections）

### _.each

遍历list中的所有元素，按顺序用遍历输出每个元素。如果传递了context参数，则把iteratee绑定到context对象上。每次调用iteratee都会传递三个参数：(element, index, list)。如果list是个JavaScript对象，iteratee的参数是 (value, key, list))。返回list以方便链式调用。

````js
// 迭代函数退出的标志
var breaker = {};

_.each = _.forEach = function(obj, iterator, context) {
	if (obj == null) return obj;

	// 区分 对象 和 数组、类数组对象(Nodelist arguments) var arraylike = {1: 'a', 2: 'b', length: 2};
	// + 等于 Number : 强制类型转换，对象是没有 length 属性的 +undefined 结果是 NaN
	if (obj.length === +obj.length) { // 数组、类数组对象 
		for (var i = 0, length = obj.length; i < length; i++) {
			if (iterator.call(context, obj[i], i, obj) === breaker) return;
		}
	}
	else { // 对象
		var keys = _.keys(obj);
		for (var i = 0, length = keys.length; i < length; i++) {
			if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
		}
	}

	return obj;
}

````

示例

````js
_.each([1, 2, 3], alert);
=> alerts each number in turn...
_.each({one: 1, two: 2, three: 3}, alert);
=> alerts each number value in turn...
````

*注意：集合函数能在数组，对象，和类数组对象，比如arguments, NodeList和类似的数据类型上正常工作。 但是它通过鸭子类型工作，所以要避免传递一个不固定length属性的对象*

----

### _.map

通过转换函数(iteratee迭代器)映射列表中的每个值产生价值的新数组。iteratee传递三个参数：value，然后是迭代 index(或 key 如果list是个JavaScript对象是，这个参数就是key)，最后一个是引用指向整个list

````js
_.map = _.collect = function(obj, iterator, context) {
	// 无论是对象还是数组，总是返回一个新数组。
	var results = [];
	if (obj == null) return results;
	_.each(obj, function(value, index, list) {
	 	result.push(iterator.call(context, value, index, list));
	})
	return results;
}
````

示例

````js
_.map([1, 2, 3], function(num){ return num * 3; });
=> [3, 6, 9]
_.map({one: 1, two: 2, three: 3}, function(num, key){ return num * 3; });
=> [3, 6, 9]
_.map([[1, 2], [3, 4]], _.first);
=> [1, 3]
````

----

### _.reduce

别名为 inject 和 foldl, reduce方法把list中元素归结为一个单独的数值。Memo是reduce函数的初始值，reduce的每一步都需要由iteratee返回。这个迭代传递4个参数：memo,value 和 迭代的index（或者 key）和最后一个引用的整个 list。

如果没有memo传递给reduce的初始调用，iteratee不会被列表中的第一个元素调用。第一个元素将取代 传递给列表中下一个元素调用iteratee的memo参数。

````js
var reduceError = 'Reduce of empty array with no initial value';

_.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
  // 判断是否传入了 memo 参数
	var initial = argument.length > 2;
	if (obj == null) obj = [];
	_.each(obj, function(value, index, list) {
		if (!initial) {
			// 如果没传入 memo，则数组第一个值就是 memo，那么第一个值是不参与迭代的。
		  memo = value;
		  initial = true
		} else {
		  // 传入了 memo， 则数组中所有值都会参与迭代。
			memo = iterator.call(context, memo, value, index, list);
	  }
	});
	// 只有 obj 是空的情况下，抛出异常
	if (!initial) throw new TypeError(reduceError);
	return memo;
}
````

示例

````js
var sum = _.reduce([1, 2, 3], function(memo, num){ return memo + num; }, 0);
=> 6
````