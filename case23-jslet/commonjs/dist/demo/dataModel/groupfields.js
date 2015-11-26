/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(19);


/***/ },

/***/ 19:
/***/ function(module, exports) {

	
	var dataSet = {};
	
	var fldCfg = [
		{ name: 'name', type: 'S', length: 30, label: 'Company Name', displayWidth: 10, required: true },
		{ name: 'y10', label: '2010', type: 'G', children:[//Group field
			{ name: 'y10q1', label: 'Q1', type: 'G', children:[ //Group field
				{ name: 'a1001', label: 'Jan.', type: 'N', length: 10, scale: 2, displayFormat: '#,##0.00' },
				{ name: 'a1002', label: 'Feb.', type: 'N', length: 10, scale: 2, displayFormat: '#,##0.00' },
				{ name: 'q1sum', label: 'sub-total', type: 'N', length: 10, scale: 2, displayFormat: '#,##0.00', formula:'[a1001]+[a1002]' }
			]},
			{ name: 'y10q2', label: 'Q2', type: 'G', children:[//Group field
				{ name: 'a1004', label: 'Apr.', type: 'N', length: 10, scale: 2, displayFormat: '#,##0.00' },
				{ name: 'a1005', label: 'May.', type: 'N', length: 10, scale: 2, displayFormat: '#,##0.00' },
				{ name: 'q2sum', label: 'sub-total', type: 'N', length: 10, scale: 2, displayFormat: '#,##0.00', formula:'[a1004]+[a1005]' }
			]},
			{ name: 'y10q3', label: 'Q3', type: 'G', children:[//Group field
				{ name: 'a1007', label: 'Jul.', type: 'N', length: 10, scale: 2, displayFormat: '#,##0.00' },
				{ name: 'a1008', label: 'Aug.', type: 'N', length: 10, scale: 2, displayFormat: '#,##0.00'},
				{ name: 'q3sum', label: 'sub-total', type: 'N', length: 16, scale: 2, displayFormat: '#,##0.00', formula:'[a1007]+[a1008]' }
			]},
			{ name: 'y10q4', label: 'Q4', type: 'G', children:[//Group field
				{ name: 'a1010', label: 'Oct.', type: 'N', length: 10, scale: 2, displayFormat: '#,##0.00' },
				{ name: 'a1011', label: 'Nov.', type: 'N', length: 10, scale: 2, displayFormat: '#,##0.00' },
				{ name: 'q4sum', label: 'sub-total', type: 'N', length: 10, scale: 2, displayFormat: '#,##0.00', formula:'[a1010]+[a1011]' }
			]},
			{ name: 'y10sum', label: '2010 Total', type: 'N', length: 10, scale: 2, displayFormat: '#,##0.00', formula:'[q1sum]+[q2sum]+[q3sum]+[q4sum]' }
		]},
		{ name: 'other', label: 'Other Total', type: 'N', length: 10, scale: 2, displayFormat: '#,##0.00' }
	    ];
	//Create dataset
	var dsGroupFields = dataSet.dsGroupFields = jslet.data.createDataset('group_field_ds', fldCfg);
	//Add demo data
	var dataList = [
	    {name:'Company1', a1001:13450, a1002:14562.69, a1004:58641, a1005:897521.65, a1007:4562, a1008:789415.58, a1010:635487, a1011:56984, other:98745787},	
	    {name:'Company2', a1001:2345, a1002:345.69, a1004:23456, a1005:1234.65, a1007:20098, a1008:12390.58, a1010:12345, a1011:123098, other:9821},	
	    {name:'Company3', a1001:896, a1002:9873.69, a1004:98448, a1005:42034.65, a1007:87009, a1008:76490.58, a1010:98732, a1011:45092, other:56728}	
	];
	
	dsGroupFields.dataList(dataList);//In real environment, you can call 'dsGroupFields.applyQuery()' to get data.
	
	module.exports = dataSet;

/***/ }

/******/ });
//# sourceMappingURL=groupfields.js.map