
var DB = {
	name: 'hong',
	version: 4,
	db: null
}

var schema = {
	tableName: 'account',
	Index: ['id', 'username']
}

var promiseOpenDB = openDB(DB);

promiseOpenDB.then(function() {
	console.log('indexedDB was opened!');
});


var usernameEl = document.querySelector('input[name="username"');
var phoneEl = document.querySelector('input[name="phone"');
var addressEl = document.querySelector('input[name="address"');
var searchEl = document.querySelector('input[name="search"');
var tableEl = document.getElementById('table');

document.getElementById('deleteDB').addEventListener('click', function() {
	deleteDB(DB);
})

document.getElementById('addUser').addEventListener('click', function() {
	var account = {
		username: usernameEl.value,
		phone: phoneEl.value,
		address: addressEl.value
	};

	addData(DB, 'account', account, function(ret) {
		console.log(ret);
	});
})

document.getElementById('searchName').addEventListener('click', function() { 
	var username = searchEl.value;
	getDataBySearch(DB, 'account', username, displayTable);
});

document.getElementById('searchAll').addEventListener('click', function() {
	getDataAll(DB, 'account', displayTable);
	// getDataById(DB, 'account', 1, function(ret) {
	// 	console.log(ret);
	// });
	// getDataByPager(DB, 'account', 2, 4, function(ret) {
	// 	console.log(ret);
	// });
	// updataData(DB, 'account', 2, {age: 1, phone: 110}, function(ret) {
	// 	console.log(ret);
	// });
});

function displayTable(ret) {
	if (ret.error === 0) {
		clearTable();
		for(var i = 0, len = ret.data.length; i < len; i++) {
			addRow(ret.data[i]);
		}
	}
}

function addRow(data) {
	var root = tableEl.querySelector('tbody');
	// var allRows = root.getElementsByTagName('tr');
	// var allCells = allRows[0].getElementsByTagName('td');
	var newRow = root.insertRow();
	var newCell0 = newRow.insertCell();
	var newCell1 = newRow.insertCell();
	var newCell2 = newRow.insertCell();
	var newCell3 = newRow.insertCell();
	var button = document.createElement('button');
	button.appendChild(document.createTextNode('delete'));

	// attributes 只读，设置值无意义
	// button.attributes.sid = data.id;
	// button.attributes.name = 'btn' + data.id;

	// 设置额外的属性
	button.setAttribute('data-id', data.id);

	// 添加属性，只能是 id name className style 
	button.id = data.id;
	button.name = 'btn' + data.id;
	button.className = 'btn btn-default';
	button.style.color = '#08c';
	button.style.cursor = 'pointer';

	console.log(button.attributes);

	console.log(button.getAttribute('data-id'));

	newCell0.innerText = data.username;
	newCell1.innerText = data.phone;
	newCell2.innerText = data.address;
	newCell3.appendChild(button);
	button.addEventListener('click', function(e) {
		var id = this.getAttribute('data-id');
		var row = this.parentNode.parentNode;
		deleteData(DB, 'account', id, function(ret) {
			if (ret.error === 0) {
				deleteRow(row);
			}
		});
	});
}

function deleteRow(row) {
	var root = tableEl.querySelector('tbody');
	root.deleteRow(row);
}

function clearTable() {
	var root = tableEl.querySelector('tbody');
	root.innerHTML = '';
}