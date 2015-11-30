
# 源码解析
-----

## 集合 （Collections）

### _.each (list, iteratee, [context])

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
### _.map (list, iteratee, [context]) 

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
### _.reduce (list, iteratee, [memo], [context]) 

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

--- 
### _.reduceRight (list, iteratee, memo, [context]) 

reducRight是从右侧开始组合的元素的reduce函数，如果存在JavaScript 1.8版本的reduceRight，则用其代替。Foldr在javascript中不像其它有懒计算的语言那么有用

````js

````

示例

````js
var list = [[0, 1], [2, 3], [4, 5]];
var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
=> [4, 5, 2, 3, 0, 1]
````

--- 
### _.find (list, predicate, [context]) 

在list中逐项查找，返回第一个通过predicate迭代函数真值检测的元素值，如果没有值传递给测试迭代器将返回undefined。 如果找到匹配的元素，函数将立即返回，不会遍历整个list。

````js

````

示例

````js
var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
=> 2
````

--- 
### _.filter (list, predicate, [context]) 

遍历list中的每个值，返回包含所有通过predicate真值检测的元素值。

````js

````

示例

````js
var evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
=> [2, 4, 6]
````

--- 
### _.where (list, properties) 

遍历list中的每一个值，返回一个数组，这个数组包含properties所列出的属性的所有的 键 - 值对。

````js

````

示例

````js
_.where(listOfPlays, {author: "Shakespeare", year: 1611});
=> [{title: "Cymbeline", author: "Shakespeare", year: 1611},
    {title: "The Tempest", author: "Shakespeare", year: 1611}]
````

--- 
### _.findWhere (list, properties) 

遍历整个list，返回匹配 properties参数所列出的所有 键 - 值 对的第一个值。

如果没有找到匹配的属性，或者list是空的，那么将返回undefined。

````js

````

示例

````js
_.findWhere(publicServicePulitzers, {newsroom: "The New York Times"});
=> {year: 1918, newsroom: "The New York Times",
  reason: "For its public service in publishing in full so many official reports,
  documents and speeches by European statesmen relating to the progress and
  conduct of the war."}
````

--- 
### _.reject (list, predicate, [context])  

返回list中没有通过predicate真值检测的元素集合，与filter相反。

````js

````

示例

````js
var odds = _.reject([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
=> [1, 3, 5]
````

--- 
### _.every (list, [predicate], [context])  

如果list中的所有元素都通过predicate的真值检测就返回true

````js

````

示例

````js
_.every([true, 1, null, 'yes'], _.identity);
=> false
````

--- 
### _.some (list, [predicate], [context])  

如果list中有任何一个元素通过 predicate 的真值检测就返回true。一旦找到了符合条件的元素, 就直接中断对list的遍历. 

````js

````

示例

````js
_.some([null, 0, 'yes', false]);
=> true
````

--- 
### _.contains (list, value, [fromIndex])  

如果list包含指定的value则返回true（愚人码头注：使用===检测）。如果list 是数组，内部使用indexOf判断。使用fromIndex来给定开始检索的索引位置。

````js

````

示例

````js
_.contains([1, 2, 3], 3);
=> true
````

--- 
### _.invoke (list, methodName, *arguments)  

在list的每个元素上执行methodName方法。 任何传递给invoke的额外参数，invoke都会在调用methodName方法的时候传递给它。

````js

````

示例

````js
_.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
=> [[1, 5, 7], [1, 2, 3]]
````

--- 
### _.pluck (list, propertyName)   

pluck也许是map最常使用的用例模型的简化版本，即萃取数组对象中某属性值，返回一个数组。

````js

````

示例

````js
var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
_.pluck(stooges, 'name');
=> ["moe", "larry", "curly"]
````

--- 
### _.max (list, [iteratee], [context])    

返回list中的最大值。如果传递iteratee参数，iteratee将作为list中每个值的排序依据。如果list为空，将返回-Infinity，所以你可能需要事先用isEmpty检查 list 。

````js

````

示例

````js
var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
_.max(stooges, function(stooge){ return stooge.age; });
=> {name: 'curly', age: 60};
````

--- 
### _.min (list, [iteratee], [context])    

返回list中的最小值。如果传递iteratee参数，iteratee将作为list中每个值的排序依据。如果list为空，将返回-Infinity，所以你可能需要事先用isEmpty检查 list 

````js

````

示例

````js
var numbers = [10, 5, 100, 2, 1000];
_.min(numbers);
=> 2
````

--- 
### _.sortBy (list, iteratee, [context])    

返回一个排序后的list拷贝副本。如果传递iteratee参数，iteratee将作为list中每个值的排序依据。迭代器也可以是字符串的属性的名称进行排序的(比如 length)。

````js

````

示例

````js
_.sortBy([1, 2, 3, 4, 5, 6], function(num){ return Math.sin(num); });
=> [5, 4, 6, 3, 1, 2]

var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
_.sortBy(stooges, 'name');
=> [{name: 'curly', age: 60}, {name: 'larry', age: 50}, {name: 'moe', age: 40}];
````

--- 
### _.groupBy (list, iteratee, [context])     

把一个集合分组为多个集合，通过 iterator 返回的结果进行分组. 如果 iterator 是一个字符串而不是函数, 那么将使用 iterator 作为各元素的属性名来对比进行分组.

````js

````

示例

````js
_.groupBy([1.3, 2.1, 2.4], function(num){ return Math.floor(num); });
=> {1: [1.3], 2: [2.1, 2.4]}

_.groupBy(['one', 'two', 'three'], 'length');
=> {3: ["one", "two"], 5: ["three"]}
````

--- 
### _.indexBy (list, iteratee, [context])     

给定一个list，和 一个用来返回一个在列表中的每个元素键 的iterator 函数（或属性名）， 返回一个每一项索引的对象。和groupBy非常像，但是当你知道你的键是唯一的时候可以使用indexBy 。

````js

````

示例

````js
var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
_.indexBy(stooges, 'age');
=> {
  "40": {name: 'moe', age: 40},
  "50": {name: 'larry', age: 50},
  "60": {name: 'curly', age: 60}
}
````

--- 
### _.countBy (list, iteratee, [context])     

排序一个列表组成一个组，并且返回各组中的对象的数量的计数。类似groupBy，但是不是返回列表的值，而是返回在该组中值的数目。

````js

````

示例

````js
_.countBy([1, 2, 3, 4, 5], function(num) {
  return num % 2 == 0 ? 'even': 'odd';
});
=> {odd: 3, even: 2}
````

--- 
### _.shuffle (list)    

返回一个随机乱序的 list 副本, 使用 Fisher-Yates shuffle 来进行随机乱序.

````js

````

示例

````js
_.shuffle([1, 2, 3, 4, 5, 6]);
=> [4, 1, 6, 3, 5, 2]
````

--- 
### _.sample (list, [n])   

从 list中产生一个随机样本。传递一个数字表示从list中返回n个随机元素。否则将返回一个单一的随机项。

````js

````

示例

````js
_.sample([1, 2, 3, 4, 5, 6]);
=> 4

_.sample([1, 2, 3, 4, 5, 6], 3);
=> [1, 6, 2]
````

--- 
### _.toArray (list)   

把list(任何可以迭代的对象)转换成一个数组，在转换 arguments 对象时非常有用。

````js

````

示例

````js
(function(){ return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
=> [2, 3, 4]
````

--- 
### _.size (list) 

返回list的长度。

````js

````

示例

````js
_.size({one: 1, two: 2, three: 3});
=> 3
````

--- 
### _.partition (array, predicate)

拆分一个数组（array）为两个数组：  第一个数组其元素都满足predicate迭代函数， 而第二个的所有元素均不能满足predicate迭代函数。

````js

````

示例

````js
_.partition([0, 1, 2, 3, 4, 5], isOdd);
=> [[1, 3, 5], [0, 2, 4]]
````


-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
## 数组 （Arrays）


### _.first (array, [n]) 

返回array（数组）的第一个元素。传递 n参数将返回数组中从第一个元素开始的n个元素（愚人码头注：返回数组中前 n 个元素.）。

````js

````

示例

````js
_.first([5, 4, 3, 2, 1]);
=> 5
````

--- 
### _.initial (array, [n])

返回数组中除了最后一个元素外的其他全部元素。 在arguments对象上特别有用。传递 n参数将从结果中排除从最后一个开始的n个元素

````js

````

示例

````js
_.initial([5, 4, 3, 2, 1]);
=> [5, 4, 3, 2]
````

--- 
### _.last (array, [n]) 

返回array（数组）的最后一个元素。传递 n参数将返回数组中从最后一个元素开始的n个元素

````js

````

示例

````js
_.last([5, 4, 3, 2, 1]);
=> 1
````

--- 
### _.rest (array, [index])  

返回数组中除了第一个元素外的其他全部元素。传递 index 参数将返回从index开始的剩余所有元素 。

````js

````

示例

````js
_.rest([5, 4, 3, 2, 1]);
=> [4, 3, 2, 1]
````

--- 
### _.compact (array)  

返回一个除去所有false值的 array副本。 在javascript中, false, null, 0, "", undefined 和 NaN 都是false值.

````js

````

示例

````js
_.compact([0, 1, false, 2, '', 3]);
=> [1, 2, 3]
````

--- 
### _.flatten (array, [shallow]) 

将一个嵌套多层的数组 array（数组） (嵌套可以是任何层数)转换为只有一层的数组。 如果你传递 shallow参数，数组将只减少一维的嵌套。

````js

````

示例

````js
_.flatten([1, [2], [3, [[4]]]]);
=> [1, 2, 3, 4];

_.flatten([1, [2], [3, [[4]]]], true);
=> [1, 2, 3, [[4]]];
````

--- 
### _.without (array, *values)  

返回一个删除所有values值后的 array副本。

````js

````

示例

````js
_.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
=> [2, 3, 4]
````

--- 
### _.union (*arrays)   

返回传入的 arrays（数组）并集：按顺序返回，返回数组的元素是唯一的，可以传入一个或多个 arrays（数组）。

````js

````

示例

````js
_.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
=> [1, 2, 3, 101, 10]
````

--- 
### _.intersection (*arrays)   

返回传入 arrays（数组）交集。结果中的每个值是存在于传入的每个arrays（数组）里。

````js

````

示例

````js
_.intersection([1, 2, 3], [101, 2, 1, 10], [2, 1]);
=> [1, 2]
````

--- 
### _.difference (array, *others)   

类似于without，但返回的值来自array参数数组，并且不存在于other 数组.

````js

````

示例

````js
_.difference([1, 2, 3, 4, 5], [5, 2, 10]);
=> [1, 3, 4]
````

--- 
### _.uniq (array, [isSorted], [iteratee])    

返回 array去重后的副本, 使用 === 做相等测试. 如果您确定 array 已经排序, 那么给 isSorted 参数传递 true值, 此函数将运行的更快的算法. 如果要处理对象元素, 传递 iteratee函数来获取要对比的属性.

````js

````

示例

````js
_.uniq([1, 2, 1, 3, 1, 4]);
=> [1, 2, 3, 4]
````

--- 
### _.zip (*arrays)    

将 每个arrays中相应位置的值合并在一起。在合并分开保存的数据时很有用. 如果你用来处理矩阵嵌套数组时, _.zip.apply 可以做类似的效果。

````js

````

示例

````js
_.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]);
=> [["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]
````

--- 
### _.unzip (*arrays)    

与zip功能相反的函数，给定若干arrays，返回一串联的新数组，其第一元素个包含所有的输入数组的第一元素，其第二包含了所有的第二元素，依此类推。通过apply用于传递数组的数组。 

````js

````

示例

````js
_.unzip([['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]])
=> ["moe", 30, true], ["larry", 40, false], ["curly", 50, false]
````

--- 
### _.object (list, [values])     

将数组转换为对象。传递任何一个单独[key, value]对的列表，或者一个键的列表和一个值得列表。 如果存在重复键，最后一个值将被返回。

````js

````

示例

````js
_.object(['moe', 'larry', 'curly'], [30, 40, 50]);
=> {moe: 30, larry: 40, curly: 50}

_.object([['moe', 30], ['larry', 40], ['curly', 50]]);
=> {moe: 30, larry: 40, curly: 50}
````

--- 
### _.indexOf (array, value, [isSorted])      

返回value在该 array 中的索引值，如果value不存在 array中就返回-1。使用原生的indexOf 函数，除非它失效。如果您正在使用一个大数组，你知道数组已经排序，传递true给isSorted将更快的用二进制搜索..,或者，传递一个数字作为第三个参数，为了在给定的索引的数组中寻找第一个匹配值。

````js

````

示例

````js
_.indexOf([1, 2, 3], 2);
=> 1
````

--- 
### _.lastIndexOf (array, value, [fromIndex])       

返回value在该 array 中的从最后开始的索引值，如果value不存在 array中就返回-1。如果支持原生的lastIndexOf，将使用原生的lastIndexOf函数。传递fromIndex将从你给定的索性值开始搜索。

````js

````

示例

````js
_.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
=> 4
````

--- 
### _.sortedIndex (list, value, [iteratee], [context])       

使用二分查找确定value在list中的位置序号，value按此序号插入能保持list原有的排序。如果提供iterator函数，iterator将作为list排序的依据，包括你传递的value 。iterator也可以是字符串的属性名用来排序(比如length)。

````js

````

示例

````js
_.sortedIndex([10, 20, 30, 40, 50], 35);
=> 3

var stooges = [{name: 'moe', age: 40}, {name: 'curly', age: 60}];
_.sortedIndex(stooges, {name: 'larry', age: 50}, 'age');
=> 1
````

--- 
### _.findIndex (array, predicate, [context])       
 
类似于_.indexOf，当predicate通过真检查时，返回第一个索引值；否则返回-1。

````js

````

示例

````js
_.findIndex([4, 6, 8, 12], isPrime);
=> -1 // not found
_.findIndex([4, 6, 7, 12], isPrime);
=> 2
````

--- 
### _.findLastIndex (array, predicate, [context])       
 
和_.findIndex类似，但反向迭代数组，当predicate通过真检查时，最接近末端的索引值将被返回。

````js

````

示例

````js
var users = [{'id': 1, 'name': 'Bob', 'last': 'Brown'},
             {'id': 2, 'name': 'Ted', 'last': 'White'},
             {'id': 3, 'name': 'Frank', 'last': 'James'},
             {'id': 4, 'name': 'Ted', 'last': 'Jones'}];
_.findLastIndex(users, {
  name: 'Ted'
});
=> 3
````

--- 
### _.range ([start], stop, [step])       
 
一个用来创建整数灵活编号的列表的函数，便于each 和 map循环。如果省略start则默认为 0；step 默认为 1.返回一个从start 到stop的整数的列表，用step来增加 （或减少）独占。值得注意的是，如果stop值在start前面（也就是stop值小于start值），那么值域会被认为是零长度，而不是负增长。-如果你要一个负数的值域 ，请使用负数step.

````js

````

示例

````js
_.range(10);
=> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
_.range(1, 11);
=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
_.range(0, 30, 5);
=> [0, 5, 10, 15, 20, 25]
_.range(0, -10, -1);
=> [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
_.range(0);
=> []
````


-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
## 函数 （Functions）


### _.bind (function, object, *arguments)        
 
绑定函数 function 到对象 object 上, 也就是无论何时调用函数, 函数里的 this 都指向这个 object.任意可选参数 arguments 可以传递给函数 function , 可以填充函数所需要的参数,这也被称为 partial application。对于没有结合上下文的partial application绑定，请使用partial。 

````js

````

示例

````js
var func = function(greeting){ return greeting + ': ' + this.name };
func = _.bind(func, {name: 'moe'}, 'hi');
func();
=> 'hi: moe'
````

--- 
### _.bindAll (object, *methodNames)       
 
把methodNames参数指定的一些方法绑定到object上，这些方法就会在对象的上下文环境中执行。绑定函数用作事件处理函数时非常便利，否则函数被调用时this一点用也没有。methodNames参数是必须的。 

````js

````

示例

````js
var buttonView = {
  label  : 'underscore',
  onClick: function(){ alert('clicked: ' + this.label); },
  onHover: function(){ console.log('hovering: ' + this.label); }
};
_.bindAll(buttonView, 'onClick', 'onHover');
// When the button is clicked, this.label will have the correct value.
jQuery('#underscore_button').bind('click', buttonView.onClick);
````

--- 
### _.partial (function, *arguments)      
 
局部应用一个函数填充在任意个数的 arguments，不改变其动态this值。和bind方法很相近。你可以传递_ 给arguments列表来指定一个不预先填充，但在调用时提供的参数。 

````js

````

示例

````js
var subtract = function(a, b) { return b - a; };
sub5 = _.partial(subtract, 5);
sub5(20);
=> 15

// Using a placeholder
subFrom20 = _.partial(subtract, _, 20);
subFrom20(5);
=> 15
````

--- 
### _.memoize (function, [hashFunction])       
 
Memoizes方法可以缓存某函数的计算结果。对于耗时较长的计算是很有帮助的。如果传递了 hashFunction 参数，就用 hashFunction 的返回值作为key存储函数的计算结果。hashFunction 默认使用function的第一个参数作为key。memoized值的缓存可作为返回函数的cache属性。

````js

````

示例

````js
var fibonacci = _.memoize(function(n) {
  return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
});
````

--- 
### _.delay (function, wait, *arguments)        
 
类似setTimeout，等待wait毫秒后调用function。如果传递可选的参数arguments，当函数function执行时， arguments 会作为参数传入。

````js

````

示例

````js
var log = _.bind(console.log, console);
_.delay(log, 1000, 'logged later');
=> 'logged later' // Appears after one second.
````

--- 
### _.defer (function, *arguments)      

延迟调用function直到当前调用栈清空为止，类似使用延时为0的setTimeout方法。对于执行开销大的计算和无阻塞UI线程的HTML渲染时候非常有用。 如果传递arguments参数，当函数function执行时， arguments 会作为参数传入。

````js

````

示例

````js
_.defer(function(){ alert('deferred'); });
// Returns from the function before the alert runs.
````

--- 
### _.throttle (function, wait, [options])       

创建并返回一个像节流阀一样的函数，当重复调用函数的时候，至少每隔 wait毫秒调用一次该函数。对于想控制一些触发频率较高的事件有帮助。

默认情况下，throttle将在你调用的第一时间尽快执行这个function，并且，如果你在wait周期内调用任意次数的函数，都将尽快的被覆盖。如果你想禁用第一次首先执行的话，传递{leading: false}，还有如果你想禁用最后一次执行的话，传递{trailing: false}。

````js

````

示例

````js
var throttled = _.throttle(updatePosition, 100);
$(window).scroll(throttled);
````

--- 
### _.debounce (function, wait, [immediate])        

返回 function 函数的防反跳版本, 将延迟函数的执行(真正的执行)在函数最后一次调用时刻的 wait 毫秒之后. 对于必须在一些输入（多是一些用户操作）停止到达之后执行的行为有帮助。 例如: 渲染一个Markdown格式的评论预览, 当窗口停止改变大小之后重新计算布局, 等等.

传参 immediate 为 true， debounce会在 wait 时间间隔的开始调用这个函数 . 在类似不小心点了提交按钮两下而提交了两次的情况下很有用。

````js

````

示例

````js
var throttled = _.throttle(updatePosition, 100);
$(window).scroll(throttled);
````

--- 
### _.once (function)        

创建一个只能调用一次的函数。重复调用改进的方法也没有效果，只会返回第一次执行时的结果。 作为初始化函数使用时非常有用, 不用再设一个boolean值来检查是否已经初始化完成.

````js

````

示例

````js
var initialize = _.once(createApplication);
initialize();
initialize();
// Application is only created once.
````

--- 
### _.after (count, function)         

创建一个函数, 只有在运行了 count 次之后才有效果. 在处理同组异步请求返回结果时, 如果你要确保同组里所有异步请求完成之后才 执行这个函数, 这将非常有用。

````js

````

示例

````js
var renderNotes = _.after(notes.length, render);
_.each(notes, function(note) {
  note.asyncSave({success: renderNotes});
});
// renderNotes is run once, after all notes have saved.
````

--- 
### _.before (count, function)          

创建一个函数,调用不超过count 次。 当count已经达到时，最后一个函数调用的结果将被记住并返回。

````js

````

示例

````js
var monthlyMeeting = _.before(3, askForRaise);
monthlyMeeting();
monthlyMeeting();
monthlyMeeting();
// the result of any subsequent calls is the same as the second call
````

--- 
### _.wrap (function, wrapper)           

将第一个函数 function 封装到函数 wrapper 里面, 并把函数 function 作为第一个参数传给 wrapper. 这样可以让 wrapper 在 function 运行之前和之后 执行代码, 调整参数然后附有条件地执行.

````js

````

示例

````js
var hello = function(name) { return "hello: " + name; };
hello = _.wrap(hello, function(func) {
  return "before, " + func("moe") + ", after";
});
hello();
=> 'before, hello: moe, after'
````

--- 
### _.negate (predicate)            

返回一个新的predicate函数的否定版本。

````js

````

示例

````js
var isFalsy = _.negate(Boolean);
_.find([-2, -1, 0, 1, 2], isFalsy);
=> 0
````

--- 
### _.compose (*functions)             

返回函数集 functions 组合后的复合函数, 也就是一个函数执行完之后把返回的结果再作为参数赋给下一个函数来执行. 以此类推. 在数学里, 把函数 f(), g(), 和 h() 组合起来可以得到复合函数 f(g(h()))。

````js

````

示例

````js
var greet    = function(name){ return "hi: " + name; };
var exclaim  = function(statement){ return statement.toUpperCase() + "!"; };
var welcome = _.compose(greet, exclaim);
welcome('moe');
=> 'hi: MOE!'
````


-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
## 对象 （Objects）


### _.keys (object)             

检索object拥有的所有可枚举属性的名称

````js

````

示例

````js
_.keys({one: 1, two: 2, three: 3});
=> ["one", "two", "three"]
````

--- 
### _.allKeys (object)              

检索object拥有的和继承的所有属性的名称。

````js

````

示例

````js
function Stooge(name) {
  this.name = name;
}
Stooge.prototype.silly = true;
_.allKeys(new Stooge("Moe"));
=> ["name", "silly"]
````

--- 
### _.values (object)              

返回object对象所有的属性值。

````js

````

示例

````js
_.values({one: 1, two: 2, three: 3});
=> [1, 2, 3]
````

--- 
### _.mapObject (object, iteratee, [context])               

它类似于map，但是这用于对象。转换每个属性的值。

````js

````

示例

````js
_.mapObject({start: 5, end: 12}, function(val, key) {
  return val + 5;
});
=> {start: 10, end: 17}
````

--- 
### _.pairs (object)                

把一个对象转变为一个[key, value]形式的数组。

````js

````

示例

````js
_.pairs({one: 1, two: 2, three: 3});
=> [["one", 1], ["two", 2], ["three", 3]]
````

--- 
### _.invert (object)                 

返回一个object副本，使其键（keys）和值（values）对换。对于这个操作，必须确保object里所有的值都是唯一的且可以序列号成字符串.

````js

````

示例

````js
_.invert({Moe: "Moses", Larry: "Louis", Curly: "Jerome"});
=> {Moses: "Moe", Louis: "Larry", Jerome: "Curly"};
````

--- 
### _.create (prototype, props)                

创建具有给定原型的新对象， 可选附加props 作为 own的属性。 基本上，和Object.create一样， 但是没有所有的属性描述符。

````js

````

示例

````js
var moe = _.create(Stooge.prototype, {name: "Moe"});
````

--- 
### _.functions (object)                

返回一个对象里所有的方法名, 而且是已经排序的 — 也就是说, 对象里每个方法(属性值是一个函数)的名称.

````js

````

示例

````js
_.functions(_);
=> ["all", "any", "bind", "bindAll", "clone", "compact", "compose" ...
````

--- 
### _.findKey (object, predicate, [context])                 

Similar to _.findIndex but for keys in objects. Returns the key where the predicate truth test passes or undefined.

````js

````

示例

````js

````

--- 
### _.extend (destination, *sources)                 

复制source对象中的所有属性覆盖到destination对象上，并且返回 destination 对象. 复制是按顺序的, 所以后面的对象属性会把前面的对象属性覆盖掉(如果有重复).

````js

````

示例

````js
_.extend({name: 'moe'}, {age: 50});
=> {name: 'moe', age: 50}
````

--- 
### _.extendOwn (destination, *sources)                 

类似于 extend, 但只复制自己的属性覆盖到目标对象。

````js

````

示例

````js

````

--- 
### _.pick (object, *keys)                 

返回一个object副本，只过滤出keys(有效的键组成的数组)参数指定的属性值。或者接受一个判断函数，指定挑选哪个key。

````js

````

示例

````js
_.pick({name: 'moe', age: 50, userid: 'moe1'}, 'name', 'age');
=> {name: 'moe', age: 50}
_.pick({name: 'moe', age: 50, userid: 'moe1'}, function(value, key, object) {
  return _.isNumber(value);
});
=> {age: 50}
````

--- 
### _.omit (object, *keys)                

返回一个object副本，只过滤出除去keys(有效的键组成的数组)参数指定的属性值。 或者接受一个判断函数，指定忽略哪个key。

````js

````

示例

````js
_.omit({name: 'moe', age: 50, userid: 'moe1'}, 'userid');
=> {name: 'moe', age: 50}
_.omit({name: 'moe', age: 50, userid: 'moe1'}, function(value, key, object) {
  return _.isNumber(value);
});
=> {name: 'moe', userid: 'moe1'}
````

--- 
### _.defaults (object, *defaults)                

用defaults对象填充object 中的undefined属性。 并且返回这个object。一旦这个属性被填充，再使用defaults方法将不会有任何效果

````js

````

示例

````js
var iceCream = {flavor: "chocolate"};
_.defaults(iceCream, {flavor: "vanilla", sprinkles: "lots"});
=> {flavor: "chocolate", sprinkles: "lots"}
````

--- 
### _.clone (object)                

创建 一个浅复制（浅拷贝）的克隆object。任何嵌套的对象或数组都通过引用拷贝，不会复制。

````js

````

示例

````js
_.clone({name: 'moe'});
=> {name: 'moe'};
````

--- 
### _.tap (object, interceptor)               

用 object作为参数来调用函数interceptor，然后返回object。这种方法的主要意图是作为函数链式调用 的一环, 为了对此对象执行操作并返回对象本身。

````js

````

示例

````js
_.chain([1,2,3,200])
  .filter(function(num) { return num % 2 == 0; })
  .tap(alert)
  .map(function(num) { return num * num })
  .value();
=> // [2, 200] (alerted)
=> [4, 40000]
````

--- 
### _.has (object, key)               

对象是否包含给定的键吗？等同于object.hasOwnProperty(key)，但是使用hasOwnProperty 函数的一个安全引用，以防意外覆盖。

````js

````

示例

````js
_.has({a: 1, b: 2, c: 3}, "b");
=> true
````

--- 
### _.property (key)               

返回一个函数，这个函数返回任何传入的对象的key属性。

````js

````

示例

````js
var stooge = {name: 'moe'};
'moe' === _.property('name')(stooge);
=> true
````

--- 
### _.propertyOf (object)               

和_.property相反。需要一个对象，并返回一个函数,这个函数将返回一个提供的属性的值。

````js

````

示例

````js
var stooge = {name: 'moe'};
_.propertyOf(stooge)('name');
=> 'moe'
````

--- 
### _.matcher (attrs)                

返回一个断言函数，这个函数会给你一个断言可以用来辨别给定的对象是否匹配attrs指定键/值属性。

````js

````

示例

````js
var ready = _.matcher({selected: true, visible: true});
var readyToGoList = _.filter(list, ready);
````

--- 
### _.isEqual (object, other)                 

执行两个对象之间的优化深度比较，确定他们是否应被视为相等。

````js

````

示例

````js
var stooge = {name: 'moe', luckyNumbers: [13, 27, 34]};
var clone  = {name: 'moe', luckyNumbers: [13, 27, 34]};
stooge == clone;
=> false
_.isEqual(stooge, clone);
=> true
````

--- 
### _.isMatch (object, properties)                

告诉你properties中的键和值是否包含在object中。

````js

````

示例

````js
var stooge = {name: 'moe', age: 32};
_.isMatch(stooge, {age: 32});
=> true
````

--- 
### _.isEmpty (object)                 

如果object 不包含任何值(没有可枚举的属性)，返回true。 对于字符串和类数组（array-like）对象，如果length属性为0，那么_.isEmpty检查返回true。

````js

````

示例

````js
_.isEmpty([1, 2, 3]);
=> false
_.isEmpty({});
=> true
````

--- 
### _.isElement (object)                 

如果object是一个DOM元素，返回true。

````js

````

示例

````js
_.isElement(jQuery('body')[0]);
=> true
````

--- 
### _.isArray (object)                

如果object是一个数组，返回true。

````js

````

示例

````js
(function(){ return _.isArray(arguments); })();
=> false
_.isArray([1,2,3]);
=> true
````

--- 
### _.isObject (value)                 

如果object是一个对象，返回true。需要注意的是JavaScript数组和函数是对象，字符串和数字不是。

````js

````

示例

````js
_.isObject({});
=> true
_.isObject(1);
=> false
````

--- 
### _.isArguments (object)                  

如果object是一个参数对象，返回true。

````js

````

示例

````js
(function(){ return _.isArguments(arguments); })(1, 2, 3);
=> true
_.isArguments([1,2,3]);
=> false
````

--- 
### _.isFunction (object)                   

如果object是一个函数（Function），返回true。

````js

````

示例

````js
_.isFunction(alert);
=> true
````

--- 
### _.isString (object)                 

如果object是一个字符串，返回true。

````js

````

示例

````js
_.isString("moe");
=> true
````

--- 
### _.isNumber (object)                  

如果object是一个数值，返回true (包括 NaN)。

````js

````

示例

````js
_.isNumber(8.4 * 5);
=> true
````

--- 
### _.isFinite (object)                   

如果object是一个有限的数字，返回true。

````js

````

示例

````js
_.isFinite(-101);
=> true

_.isFinite(-Infinity);
=> false
````

--- 
### _.isBoolean (object)                  

如果object是一个布尔值，返回true，否则返回false。

````js

````

示例

````js
_.isBoolean(null);
=> false
````

--- 
### _.isDate (object)                  

Returns true if object is a Date.

````js

````

示例

````js
_.isDate(new Date());
=> true
````

--- 
### _.isRegExp (object)                  

如果object是一个正则表达式，返回true。

````js

````

示例

````js
_.isRegExp(/moe/);
=> true
````

--- 
### _.isError (object)                 

如果object继承至 Error 对象，那么返回 true。

````js

````

示例

````js
try {
  throw new TypeError("Example");
} catch (o_O) {
  _.isError(o_O)
}
=> true
````

--- 
### _.isNaN (object)                  

如果object是 NaN，返回true。 
注意： 这和原生的isNaN 函数不一样，如果变量是undefined，原生的isNaN 函数也会返回 true 。

````js

````

示例

````js
_.isNaN(NaN);
=> true
isNaN(undefined);
=> true
_.isNaN(undefined);
=> false
````

--- 
### _.isNull (object)                  

如果object的值是 null，返回true。

````js

````

示例

````js
_.isNull(null);
=> true
_.isNull(undefined);
=> false
````

--- 
### _.isUndefined (value)                  

如果value是undefined，返回true。

````js

````

示例

````js
_.isUndefined(window.missingVariable);
=> true
````


-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
## 实用功能 （Utility）


### _.noConflict ()                  

放弃Underscore 的控制变量"_"。返回Underscore 对象的引用。

````js

````

示例

````js
var underscore = _.noConflict();
````

--- 
### _.identity (value)                  

返回与传入参数相等的值. 相当于数学里的: f(x) = x
这个函数看似无用, 但是在Underscore里被用作默认的迭代器iterator.

````js

````

示例

````js
var stooge = {name: 'moe'};
stooge === _.identity(stooge);
=> true
````

--- 
### _.constant (value)                 

创建一个函数，这个函数 返回相同的值 用来作为_.constant的参数。

````js

````

示例

````js
var stooge = {name: 'moe'};
stooge === _.constant(stooge)();
=> true
````

--- 
### _.noop ()                  

返回undefined，不论传递给它的是什么参数。 可以用作默认可选的回调参数。

````js

````

示例

````js
obj.initialize = _.noop;
````

--- 
### _.times (n, iteratee, [context])                  

调用给定的迭代函数n次,每一次调用iteratee传递index参数。生成一个返回值的数组。

````js

````

示例

````js
_(3).times(function(n){ genie.grantWishNumber(n); });
````

--- 
### _.random (min, max)                   

返回一个min 和 max之间的随机整数。如果你只传递一个参数，那么将返回0和这个参数之间的整数。

````js

````

示例

````js
_.random(0, 100);
=> 42
````

--- 
### _.mixin (object)                   

允许用您自己的实用程序函数扩展Underscore。传递一个 {name: function}定义的哈希添加到Underscore对象，以及面向对象封装。

````js

````

示例

````js
_.mixin({
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  }
});
_("fabio").capitalize();
=> "Fabio"
````

--- 
### _.iteratee (value, [context])                    

一个重要的内部函数用来生成可应用到集合中每个元素的回调， 返回想要的结果 - 无论是等式，任意回调，属性匹配，或属性访问。 
通过_.iteratee转换判断的Underscore 方法的完整列表是 map, find, filter, reject, every, some, max, min, sortBy, groupBy, indexBy, countBy, sortedIndex, partition, 和 unique.

````js

````

示例

````js
var stooges = [{name: 'curly', age: 25}, {name: 'moe', age: 21}, {name: 'larry', age: 23}];
_.map(stooges, _.iteratee('age'));
=> [25, 21, 23];
````

--- 
### _.uniqueId ([prefix])                    

为需要的客户端模型或DOM元素生成一个全局唯一的id。如果prefix参数存在， id 将附加给它。

````js

````

示例

````js
_.uniqueId('contact_');
=> 'contact_104'
````

--- 
### _.escape (string)    
               
转义HTML字符串，替换&, <, >, ", ', 和 /字符。

````js

````

示例

````js
_.escape('Curly, Larry & Moe');
=> "Curly, Larry &amp; Moe"
````

--- 
### _.unescape (string)     
               
和escape相反。转义HTML字符串，替换&, &lt;, &gt;, &quot;, &#96;, 和 &#x2F;字符。

````js

````

示例

````js
_.unescape('Curly, Larry &amp; Moe');
=> "Curly, Larry & Moe"
````

--- 
### _.result (object, property, [defaultValue])    
               
如果指定的property 的值是一个函数，那么将在object上下文内调用它;否则，返回它。如果提供默认值，并且属性不存在，那么默认值将被返回。如果设置defaultValue是一个函数，它的结果将被返回。

````js

````

示例

````js
var object = {cheese: 'crumpets', stuff: function(){ return 'nonsense'; }};
_.result(object, 'cheese');
=> "crumpets"
_.result(object, 'stuff');
=> "nonsense"
_.result(object, 'meat', 'ham');
=> "ham"
````

--- 
### _.now ()     
               
一个优化的方式来获得一个当前时间的整数时间戳。可用于实现定时/动画功能。

````js

````

示例

````js
_.now();
=> 1392066795351
````

--- 
### _.template (templateString, [settings])     
               
将 JavaScript 模板编译为可以用于页面呈现的函数, 对于通过JSON数据源生成复杂的HTML并呈现出来的操作非常有用。 模板函数可以使用 <%= … %>插入变量, 也可以用<% … %>执行任意的 JavaScript 代码。 如果您希望插入一个值, 并让其进行HTML转义,请使用<%- … %>。 当你要给模板函数赋值的时候，可以传递一个含有与模板对应属性的data对象 。 如果您要写一个一次性的, 您可以传对象 data 作为第二个参数给模板 template 来直接呈现, 这样页面会立即呈现而不是返回一个模板函数. 参数 settings 是一个哈希表包含任何可以覆盖的设置 _.templateSettings.

````js

````

示例

````js
var compiled = _.template("hello: <%= name %>");
compiled({name: 'moe'});
=> "hello: moe"

````


-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
## 链式语法 （Chaining）


### _.chain (obj)      
               
返回一个封装的对象. 在封装的对象上调用方法会返回封装的对象本身, 直道 value 方法调用为止.

````js

````

示例

````js
var stooges = [{name: 'curly', age: 25}, {name: 'moe', age: 21}, {name: 'larry', age: 23}];
var youngest = _.chain(stooges)
  .sortBy(function(stooge){ return stooge.age; })
  .map(function(stooge){ return stooge.name + ' is ' + stooge.age; })
  .first()
  .value();
=> "moe is 21"
````

--- 
### _(obj).value()      
               
获取封装对象的最终值.

````js

````

示例

````js
_([1, 2, 3]).value();
=> [1, 2, 3]
````