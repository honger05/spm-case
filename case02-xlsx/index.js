/**
  write data to excel file and export it.
**/
var filesaver = require('filesaver');
var CSV = require('csv');

var use_worker = typeof Worker !== 'undefined';

var XW = {
	msg: "xlsx",
	rABS: "./xlsxworker2.js"
}

var csvdata = '\
1850,20,0,1,1017281\r\n\
1850,20,0,2,1003841\r\n\
1850,20,0,3,1003243';

var parseData = new CSV(csvdata).parse();

function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}
 
function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';
			
			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}
 
/* original data */
var data = [[001,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
var ws_name = "SheetJS";

var data1 = [
  ['001',211,300],
  [true, false, null, "sheetjs"],
  ["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], 
  ["baz", null, "qux"]
]
var ws_name1 = "OtherJS";
 
function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}
 
var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
 
/* add worksheet to workbook */
wb.SheetNames.push(ws_name);
wb.Sheets[ws_name] = ws;

var ws1 = sheet_from_array_of_arrays(parseData);
wb.SheetNames.push(ws_name1);
wb.Sheets[ws_name1] = ws1;

var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

// String to ArrayBuffer
function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

// ArrayBuffer to String
function ab2str(data) {
	var o = "", l = 0, w = 10240;
	for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint16Array(data.slice(l*w,l*w+w)));
	o+=String.fromCharCode.apply(null, new Uint16Array(data.slice(l*w)));
	return o;
}

document.getElementById("download").addEventListener('click', function() {
	var suffix = get_radio_value('suffix');
	switch(suffix){
		case 'csv':
			filesaver.saveAs(new Blob([csvdata], {type: "text/plain"}), 'test.csv');
			break;
		default:
			filesaver.saveAs(new Blob([s2ab(wbout)], {type:"application/octet-stream"}), "test.xlsx");
			break;
	}
});

/**
  table export to excel file
**/
function export_table_to_excel(id) {
	var theTable = document.getElementById(id);
	var oo = generateArray(theTable);
	var ranges = oo[1];

	/* original data */
	var data = oo[0];
	var ws_name = "SheetJS";
	console.log(data); 

	var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
	 
	/* add ranges to worksheet */
	ws['!merges'] = ranges;

	/* add worksheet to workbook */
	wb.SheetNames.push(ws_name);
	wb.Sheets[ws_name] = ws;

	var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});

	filesaver.saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "test.xlsx")

}

function generateArray(table) {
    var out = [];
    var rows = table.querySelectorAll('tr');
    var ranges = [];
    for (var R = 0; R < rows.length; ++R) {
        var outRow = [];
        var row = rows[R];
        var columns = row.querySelectorAll('td');
        for (var C = 0; C < columns.length; ++C) {
            var cell = columns[C];
            var colspan = cell.getAttribute('colspan');
            var rowspan = cell.getAttribute('rowspan');
            var cellValue = cell.innerText;
            if(cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

            //Skip ranges
            ranges.forEach(function(range) {
                if(R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                    for(var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
                }
            });

            //Handle Row Span
            if (rowspan || colspan) {
                rowspan = rowspan || 1;
                colspan = colspan || 1;
                ranges.push({s:{r:R, c:outRow.length},e:{r:R+rowspan-1, c:outRow.length+colspan-1}});
            };
            
            //Handle Value
            outRow.push(cellValue !== "" ? cellValue : null);
            
            //Handle Colspan
            if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
        }
        out.push(outRow);
    }
    return [out, ranges];
};

var table2excelEl = document.getElementById('table2excel');
table2excelEl.addEventListener('click', export_table_to_excel.bind(this, 'table'));
//---------------------------------------------------
/**
  parse excel file.
**/
var selectFilesEl = document.getElementById('selectFiles');
var selectTrueFilesEl = document.getElementById('selectTrueFiles');
var dropEl = document.getElementById('drop');
var outEl = document.getElementById('out');

function handleChange(e) {
	var files = e.target.files;
	readFiles(files);
}

function handleClick(e) {
	selectTrueFilesEl.click();
}

selectFilesEl.addEventListener('click', handleClick, false);

selectTrueFilesEl.addEventListener('change', handleChange, false);

function handleDrop(e) {
	e.preventDefault();
  e.stopPropagation();
  var files = e.dataTransfer.files;
  readFiles(files);
}

function handleCSV(data) {
	var data = CSV.parse(data);
	outEl.innerText = data.join('\n');
}

function handleWorkbook(workbook) {
	var output = '';
	switch (get_radio_value('format')) {
		case 'json':
			output = JSON.stringify(to_json(workbook), 2, 2);
			break;
		case 'form':
		  output = to_formulae(workbook);
		  break;
		default:
		  output = to_csv(workbook);
	}
	outEl.innerText = output;
}

function allowDrop(e) {
	console.log('yes, you can drop');
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}

function get_radio_value(radioName) {
	var radiosEl = document.getElementsByName(radioName);
	for (var i = 0, len = radiosEl.length; i < len; i++) {
		if (radiosEl[i].checked || len === 1) {
			return radiosEl[i].value;
		}
	}
}

function to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function(sheetName) {
		var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if (roa.length > 0) {
    	result[sheetName] = roa;
		}
	});
	return result;
}

function to_csv(workbook) {
	var result = [];
	workbook.SheetNames.forEach(function(sheetName) {
		var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
		if (csv.length > 0) {
			result.push('SHEET: ' + sheetName);
			result.push('');
			result.push(csv);
		}
	});
	return result.join('\n');
}

function to_formulae(workbook) {
	var result = [];
	workbook.SheetNames.forEach(function(sheetName) {
		var formulae = XLSX.utils.get_formulae(workbook.Sheets[sheetName]);
		if (formulae.length > 0) {
			result.push('SHEET: ' + sheetName);
			result.push('');
			result.push(formulae.join('\n'));
		}
	});
	return result.join('\n');
}

function xw_xfer(data, cb) {
	var worker = new Worker(XW.rABS);
	worker.onmessage = function(e) {
		switch(e.data.t) {
			case 'ready': break;
			case 'e': console.error(e.data.d); break;
			default: xx=ab2str(e.data).replace(/\n/g,"\\n").replace(/\r/g,"\\r"); console.log("done"); cb(JSON.parse(xx)); break;
		}
	};
	var val = s2ab(data);
	worker.postMessage(val[1], [val[1]]);
}

function readFiles(files) {
	var i, f, len;
  for (i = 0, len = files.length; i < len; ++i) {
  	f = files[i];
		var reader = new FileReader();
		var name = f.name;
		var suffix = name.substring(name.lastIndexOf('.') + 1);
		reader.onload = function(e) {
			var data = e.target.result;
			switch(suffix){
				case 'csv':
					handleCSV(data);
					break;
				default:
						var workbook = XLSX.read(data, {type: 'binary'});
						handleWorkbook(workbook);
					break;
			}
		};
		reader.readAsBinaryString(f);
	}
}

dropEl.addEventListener('dragover', allowDrop, false);
dropEl.addEventListener('drop', handleDrop, false);