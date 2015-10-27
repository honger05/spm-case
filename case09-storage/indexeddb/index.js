
var DB = {
	name: 'hong',
	version: 2,
	db: null
}

var schema = {
	tableName: 'account',
	Index: ['id', 'username']
}

initDB(DB);

document.getElementById('deleteDB').addEventListener('click', function() {
	deleteDB(DB);
})