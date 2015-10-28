/**
 * indexedDB api
 */

var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

/**
 * @describle 初始化数据库，不存在则创建
 * @Author    Honger05
 * @DateTime  2015-10-27T17:10:04+0800
 * @param     {[type]}                 db [description]
 * @return    {[type]}                    [description]
 */
function openDB(db) {

	var promise = new Promise();

	db.version = db.version || 1;

	var request = indexedDB.open(db.name, db.version);

	request.onerror = function(e) {
		console.log(e.currentTarget.error.message);
		promise.reject();
	};

	request.onsuccess = function(e) {
		db.db = e.target.result;
		promise.resolve(db.db);
	};

	request.onupgradeneeded = function(e) {
		var thisDB = e.target.result, objStore;
		if (!thisDB.objectStoreNames.contains('account')) {
			objStore = thisDB.createObjectStore('account', {keyPath: "id", autoIncrement: true});
			objStore.createIndex('id', 'id', {unique: true});
			objStore.createIndex('username', 'username', {unique: false});

			//插入初始化测试数据 
			objStore.put({username: '张三', phone: 18363908, address: 'guangzhou'});
			objStore.put({username: '张三', phone: 19854841, address: 'hunan'});
			objStore.put({username: '张四', phone: 18363908, address: 'hunan'});
		}
	};

	return promise;
}

function closeDB(db) {
	db.db.close();
}

function deleteDB(db) {
	// 会引发页面刷新
	indexedDB.deleteDatabase(db.name);
}

/**
 * @describle 添加数据
 * @Author    Honger05
 * @DateTime  2015-10-27T17:09:44+0800
 * @param     {[type]}                 db        [description]
 * @param     {[type]}                 tableName [description]
 * @param     {[type]}                 data      [description]
 * @param     {Function}               cb        [description]
 */
function addData(db, tableName, data, cb) {
	var transaction = db.db.transaction(tableName, 'readwrite');

	transaction.oncomplete = function() {
		console.log('transaction complete');
	}

	transaction.onerror = function(e) {
		console.log(e);
	}

	var objectStore = transaction.objectStore(tableName);

	var request = objectStore.add(data);

	request.onsuccess = function(e) {
		if (cb) {
			cb({error: 0, data: data});
		}
	}

	request.onerror = function(e) {
		if (cb) {
			cb({error: 1})
		}
	}
}

/**
 * @describle 根据id 删除
 * @Author    Honger05
 * @DateTime  2015-10-27T17:09:00+0800
 * @param     {[type]}                 db        [description]
 * @param     {[type]}                 tableName [description]
 * @param     {[type]}                 id        [description]
 * @param     {Function}               cb        [description]
 * @return    {[type]}                           [description]
 */
function deleteData(db, tableName, id, cb) {
	var transaction = db.db.transaction(tableName, 'readwrite');

	transaction.oncomplete = function() {
		console.log('transaction complete');
	}

	transaction.onerror = function(e) {
		console.log(e);
	}

	var objectStore = transaction.objectStore(tableName);

	var request = objectStore.delete(parseInt(id));

	request.onsuccess = function(e) {
		if (cb) {
			cb({error: 0, data: parseInt(id)})
		}
	}

	request.onerror = function(e) {
		cb && cb({error: 1})
	}
}

/**
 * @describle 获得全部数据 -- 使用游标
 * @Author    Honger05
 * @DateTime  2015-10-27T17:18:07+0800
 * @param     {[type]}                 db        [description]
 * @param     {[type]}                 tableName [description]
 * @param     {Function}               cb        [description]
 * @return    {[type]}                           [description]
 */
function getDataAll(db, tableName, cb) {
	var transaction = db.db.transaction(tableName, 'readonly');

	transaction.oncomplete = function() {
		console.log('transaction complete');
	}

	transaction.onerror = function(e) {
		console.log(e);
	}

	var objectStore = transaction.objectStore(tableName);

	var rowData = [];

	objectStore.openCursor(IDBKeyRange.lowerBound(0)).onsuccess = function(e) {
		var cursor = e.target.result;
		if (!cursor && cb) {
			return cb({error: 0, data: rowData});
		}
		rowData.push(cursor.value);
		cursor.continue();
	}
}

/**
 * @describle 根据 keypath 查找
 * @Author    Honger05
 * @DateTime  2015-10-27T17:22:18+0800
 * @param     {[type]}                 db        [description]
 * @param     {[type]}                 tableName [description]
 * @param     {[type]}                 id        [description]
 * @param     {Function}               cb        [description]
 * @return    {[type]}                           [description]
 */
function getDataById(db, tableName, id, cb) {
	var transaction = db.db.transaction(tableName, 'readwrite');

	transaction.oncomplete = function () {
      console.log("transaction complete");
  };
  transaction.onerror = function (event) {
      console.dir(event)
  };

  var objectStore = transaction.objectStore(tableName);

  var request = objectStore.get(id);

  request.onsuccess = function(e) {
  	cb && cb({error: 0, data: e.target.result})
  }

  request.onerror = function(e) {
  	cb && cb({error: 1})
  }

}

/**
 * @describle 根据索引获取数据
 * @Author    Honger05
 * @DateTime  2015-10-27T17:28:01+0800
 * @param     {[type]}                 db        [description]
 * @param     {[type]}                 tableName [description]
 * @param     {[type]}                 keywords  [description]
 * @param     {Function}               cb        [description]
 * @return    {[type]}                           [description]
 */
function getDataBySearch(db, tableName, keywords, cb) {
	var transaction = db.db.transaction(tableName, 'readwrite');

	transaction.oncomplete = function () {
      console.log("transaction complete");
  };
  transaction.onerror = function (event) {
      console.dir(event)
  };

  var objectStore = transaction.objectStore(tableName);

  var boundKeyRange = IDBKeyRange.only(keywords);

  var rowData = [];

  objectStore.index('username').openCursor(boundKeyRange).onsuccess = function(e) {
  	var cursor = e.target.result;
  	if (!cursor && cb) {
  		return cb({error: 0, data: rowData});
  	}

  	rowData.push(cursor.value);
  	cursor.continue();
  }
}


/**
 * @describle 根据页码获取数据
 * @Author    Honger05
 * @DateTime  2015-10-27T17:30:51+0800
 * @param     {[type]}                 db        [description]
 * @param     {[type]}                 tableName [description]
 * @param     {[type]}                 start     [description]
 * @param     {[type]}                 end       [description]
 * @param     {Function}               cb        [description]
 * @return    {[type]}                           [description]
 */
function getDataByPager(db, tableName, start, end, cb) {
	var transaction = db.db.transaction(tableName, 'readwrite');

	transaction.oncomplete = function () {
      console.log("transaction complete");
  };
  transaction.onerror = function (event) {
      console.dir(event)
  };

  var objectStore = transaction.objectStore(tableName);

  var boundKeyRange = IDBKeyRange.bound(start, end, false, false);

  var rowData = [];

	objectStore.index('id').openCursor(boundKeyRange).onsuccess = function(e) {
  	var cursor = e.target.result;
  	if (!cursor && cb) {
  		 return cb({error: 0, data: rowData});
  	}

  	rowData.push(cursor.value);
  	cursor.continue();
  }
}

function updataData(db, tableName, id, updataData, cb) {
	var transaction = db.db.transaction(tableName, 'readwrite');

	transaction.oncomplete = function () {
      console.log("transaction complete");
  };
  transaction.onerror = function (event) {
      console.dir(event)
  };

  var objectStore = transaction.objectStore(tableName);

  var request = objectStore.get(id);

  request.onsuccess = function(e) {
  	var thisDB = e.target.result;
  	for (var key in updataData) {
  		thisDB[key] = updataData[key];
  	}
  	objectStore.put(thisDB);
  	cb && cb({error: 0, data: thisDB});
  }

  request.onerror = function(e) {
  	cb && cb({error: 1})
  }
}