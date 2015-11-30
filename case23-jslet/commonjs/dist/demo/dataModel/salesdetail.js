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

	module.exports = __webpack_require__(20);


/***/ },

/***/ 20:
/***/ function(module, exports) {

	
	var dataSet = {};
	
	//Create lookup dataset
	var dsPaymentTerm = jslet.data.createEnumDataset("dsPaymentTerm", {'01':'M/T','02':'T/T'});
	//------------------------------------------------------------------------------------------------------
	
	var dsCustomer = jslet.data.createEnumDataset("dsCustomer", {'01':'ABC','02':'Oil Group LTD','03':'Mail Group LTD'});
	//------------------------------------------------------------------------------------------------------
	
	//Create master dataset and its fields
	var dsSaleMaster = dataSet.dsSaleMaster = new jslet.data.Dataset("dsSaleMaster");
	var fldObj = jslet.data.createStringField("saleid", 8);
	fldObj.label("Sales ID");
	dsSaleMaster.addField(fldObj);
	
	fldObj = jslet.data.createDateField("saledate");
	fldObj.displayFormat("yyyy-MM-dd");
	fldObj.label("Sales Date");
	dsSaleMaster.addField(fldObj);
	
	fldObj = jslet.data.createStringField("customer", 20);
	fldObj.label("Customer");
	var lkFld = new jslet.data.FieldLookup();
	lkFld.dataset(dsCustomer);
	fldObj.lookup(lkFld);
	dsSaleMaster.addField(fldObj);
	
	fldObj = jslet.data.createStringField("paymentterm", 10);
	fldObj.label("Payment Term");
	lkFld = new jslet.data.FieldLookup();
	lkFld.dataset(dsPaymentTerm);
	fldObj.lookup(lkFld);
	dsSaleMaster.addField(fldObj);
	
	fldObj = jslet.data.createStringField("comment", 20);
	fldObj.label("Comment");
	fldObj.displayWidth(30);
	dsSaleMaster.addField(fldObj);
	//------------------------------------------------------------------------------------------------------
	
	//Create detail dataset and its fields 
	var dsSaleDetail = dataSet.dsSaleDetail = new jslet.data.Dataset("dsSaleDetail");
	fldObj = jslet.data.createNumberField("seqno");
	fldObj.label("Number");
	dsSaleDetail.addField(fldObj);
	
	fldObj = jslet.data.createStringField("product", 10);
	fldObj.label("Product");
	dsSaleDetail.addField(fldObj);
	
	fldObj = jslet.data.createNumberField("num", 8);
	fldObj.label("Num");
	fldObj.displayFormat("#,##0");
	dsSaleDetail.addField(fldObj);
	
	fldObj = jslet.data.createNumberField("price", 10, 2);
	fldObj.label("Price");
	fldObj.displayFormat("#,##0.00");
	dsSaleDetail.addField(fldObj);
	
	fldObj = jslet.data.createNumberField("amount", 10, 2);
	fldObj.label("Amount");
	fldObj.formula("[num]*[price]");
	fldObj.displayFormat("#,##0.00");
	dsSaleDetail.addField(fldObj);
	
	//Important! Create "DatasetField" in master dataset, and connect to detail dataset.
	fldObj = jslet.data.createDatasetField("details", dsSaleDetail);
	dsSaleMaster.addField(fldObj);
	//------------------------------------------------------------------------------------------------------
	
	//Add data into detail dataset
	var detail1 = [{ "seqno": 1, "product": "P1", "num": 2000, "price": 11.5 },
	{ "seqno": 2, "product": "P2", "num": 1000, "price": 11.5 },
	{ "seqno": 3, "product": "P3", "num": 3000, "price": 11.5 },
	{ "seqno": 4, "product": "P4", "num": 5000, "price": 11.5 },
	{ "seqno": 5, "product": "P5", "num": 8000, "price": 11.5}];
	
	var detail2 = [{ "seqno": 1, "product": "M1", "num": 1, "price": 10001 },
	{ "seqno": 2, "product": "M2", "num": 2, "price": 30000}];
	
	//Add data into master dataset
	var dataList = [{ "saleid": "200901001", "saledate": new Date(2001, 1, 1), "customer": "02", "paymentterm": "02", "details": detail1 },
	{ "saleid": "200901002", "saledate": new Date(2001, 1, 1), "customer": "01", "paymentterm": "01", "details": detail2 },
	{ "saleid": "200901003", "saledate": new Date(2001, 1, 1), "customer": "02", "paymentterm": "02"}];
	dsSaleMaster.dataList(dataList);
	
	module.exports = dataSet;


/***/ }

/******/ });
//# sourceMappingURL=salesdetail.js.map