// define Dataset Object
var lkf,dataList;

var dsFieldDatatype = jslet.data.createEnumDataset('fieldDatatype', 'S-String;N-Number;D-Date;B-Boolean;V-Dataset;G-Group'); 
var dsFieldAlignment = jslet.data.createEnumDataset('fieldAlignment', 'left-Left;center-Center;right-Right'); 
var dsFieldUrlTarget = jslet.data.createEnumDataset('fieldUrlTarget', '_blank-Blank;_parent-Parent;_self-Self;_top-Top');
var dsFieldEditor = jslet.data.createEnumDataset('fieldEditor', 
'DBText-Text Control;DBDataLabel-Data Label Control;DBPassword-Password Control;DBTextArea-TextArea Control;DBSpinEdit-Spin Edit Control;DBCheckBox-Checkbox Control;'+
'DBCheckBoxGroup-Checkbox Group Control;DBRadioGroup-Radio Group Control;DBSelect-Select Control;DBRangeSelect-Range Select Control;DBComboSelect-Popup Dropdown Control;' + 
'DBAutoComplete-AutoComplete Control;DBDatePicker-DatePicker Control;DBImage-Image Control;DBRating-Rating Control;DBHtml-Html Display;DBRating-Rating Control;DBBetweenEdit-Between style editor'
);  

var fldCfg = [
	{ name: 'index', type: 'N', length: 3, label: 'Num#', displayWidth: 6, defaultValue: 0, diaplayFormat: '##0', editControl:'DBSpinEdit' },
	{ name: 'name', type: 'S', length: 30, label: 'Field Name', displayWidth: 20, required: true },
	{ name: 'label', type: 'S', length: 30, label: 'Field Label', displayWidth: 20 },
	{ name: 'type', type: 'S', length: 1, label: 'Data Type', lookupField: '{lookupDataset:"fieldDatatype"}', displayWidth: 10, defaultValue:'S' },
    { name: 'subDataset', type: 'S', length: 30, label: 'Sub-Dataset Name', displayWidth: 10 },
	{ name: 'length', type: 'N', length: 3, label: 'Data Length', displayWidth: 10, diaplayFormat: '##0', editControl: 'DBSpinEdit' },
	{ name: 'scale', type: 'N', length: 3, label: 'Data Scale', displayWidth: 6, diaplayFormat: '##0', editControl:'DBSpinEdit'},
	{ name: 'defaultExpr', type: 'S', length: 100, label: 'Default Value', displayWidth: 10 },

	{ name: 'displayWidth', type: 'N', length: 3, label: 'Display Width', displayWidth: 10, diaplayFormat: '##0',editControl:'DBSpinEdit'},
	{ name: 'alignment', type: 'S', length: 3, label: 'Alignment', displayWidth: 10, lookupField: '{lookupDataset:"fieldAlignment"}' },
	{ name: 'displayFormat', type: 'S', length: 30, label: 'Display Format', displayWidth: 10 },
	{ name: 'editControl', type: 'S', length: 100, label: 'Editor', displayWidth: 10, lookupField: '{lookupDataset:"fieldEditor"}',required:false,nullText:'(auto)' },

	{ name: 'formula', type: 'S', length: 100, label: 'Formula', displayWidth: 10 },
	{ name: 'readOnly', type: 'B', label: 'ReadOnly', displayWidth: 10 },
	{ name: 'visible', type: 'B', label: 'Visible', displayWidth: 10 },
	{ name: 'unitConverted', type: 'B', label: 'Scaleable', displayWidth: 10 },

	{ name: 'required', type: 'B', label: 'required', displayWidth: 10 },
	{ name: 'dataRange', type: 'S', length: 50, label: 'Data Range', displayWidth: 10 },
	{ name: 'regularExpr', type: 'S', length: 50, label: 'Regular Expression', displayWidth: 10 },

	{ name: 'lookupField', type: 'S', length: 100, label: 'Lookup Field', displayWidth: 10 },
	{ name: 'urlExpr', type: 'S', length: 100, label: 'HyperLink Expression', displayWidth: 10 },
	{ name:'urlTarget',type:'S',length:10,label:'HyperLink Target',lookupField:'{lookupDataset:"fieldUrlTarget"}'},

	{ name: 'betweenStyle', type: 'B', label: 'Between Style', displayWidth: 10 },
	{ name: 'maxValueField', type: 'S', length: 30, label: 'Maximum Field Name', displayWidth: 10 },

	{ name: 'clientTranslate', type: 'B', label: 'Client Translate', displayWidth: 10, defaultValue: true },
	{ name: 'inputValueField', type: 'S', length: 30, label: 'Input Value Field', displayWidth: 10 },
	{ name: 'displayValueField', type: 'S', length: 30, label: 'Display Value Field', displayWidth: 10 }
];

var dsFieldCfg = jslet.data.createDataset('fieldCfg', fldCfg, 'name', 'name', 'label');

fldCfg = [
	{ name: 'name', type: 'S', length: 30, label: 'Dataset Name', displayWidth: 20, required: true },
	{ name: 'description', type: 'S', length: 100, label: 'description', displayWidth: 20 },
	{ name: 'keyField', type: 'S', length: 30, label: 'Key Field', displayWidth: 10,required: false },
	{ name: 'inputValueField', type: 'S', length: 30, label: 'Input Value Field', displayWidth: 10 },
	{ name: 'displayValueField', type: 'S', length: 30, label: 'Display Value Field', displayWidth: 10 },
	{ name: 'parentField', type: 'S', length: 30, label: 'Parent Field', displayWidth: 10 },
	{ name: 'fields', type: 'V', label: 'fields',subDataset:'fieldCfg', visible:false }
    ];

var dsDatasetCfg = jslet.data.createDataset('datasetCfg', fldCfg);
delete fldCfg;

var data = [
     {name: 'DBLabel', description: 'DBLabel Control', fields:
        [{ index: 0, name: 'dataset', label: 'dataset', type: 'S', length: 20, displayWidth: 20, alignment: 'left', required: true },
        { index: 1, name: 'field', label: 'field', type: 'S', length: 20, alignment: 'left', required: true}]
     },
        
     { name: 'DBDataLabel', description: 'DBDataLabel', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true}]
     },
     { name: 'DBText', description: 'DBText', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true}]
     },
     { name: 'DBPassword', description: 'DBPassword', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true}]
     },
     { name: 'DBTextArea', description: 'DBTextArea', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true}]
     },
     { name: 'DBSelect', description: 'DBSelect', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true },
         { index: 2, name: 'groupField', label: 'groupField', type: 'S', length: 20},
         { index: 3, name: 'lookupDataset', label: 'lookupDataset', type: 'S', length: 20}]
     },
     { name: 'DBRangSelect', description: 'DBRangSelect', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true},
         { index: 2, name: 'beginItem', label: 'beginItem', type: 'N', length: 10 },
         { index: 3, name: 'endItem', label: 'endItem', type: 'N', length: 10 },
         { index: 4, name: 'step', label: 'step', type: 'N', length: 10,defaultExpr:'1'}]
     },
     { name: 'DBCheckBox', description: 'DBCheckBox', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true}]
     },
     { name: 'DBSpinEdit', description: 'DBSpinEdit', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true},
         { index: 2, name: 'minValue', label: 'minValue', type: 'N', length: 10 },
         { index: 3, name: 'maxValue', label: 'maxValue', type: 'N', length: 10 },
         { index: 4, name: 'step', label: 'step', type: 'N', length: 10,defaultExpr:'1'}]
     },
     { name: 'DBRadioGroup', description: 'DBRadioGroup', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true },
         { index: 2, name: 'columnCount', label: 'columnCount', type: 'N', length: 10 }]
     },
     { name: 'DBCheckBoxGroup', description: 'DBCheckBoxGroup', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true },
         { index: 2, name: 'columnCount', label: 'columnCount', type: 'N', length: 10 }]
     },
     { name: 'DBImage', description: 'DBImage', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true },
         { index: 2, name: 'altField', label: 'altField', type: 'S', length: 20 },
         { index: 3, name: 'baseUrl', label: 'baseUrl', type: 'S', length: 20 },
         { index: 4, name: 'locked', label: 'locked', type: 'B' },
         ]
     },
     { name: 'DBBetweenEdit', description: 'DBBetweenEdit', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 2, name: 'field', label: 'field', type: 'S', length: 20}]
     },
     { name: 'DBRating', description: 'DBRating', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true },
         { index: 2, name: 'itemCount', label: 'itemCount', type: 'N', length: 10 },
         { index: 3, name: 'splitCount', label: 'splitCount', type: 'N', length: 10 },
         { index: 4, name: 'itemWidth', label: 'itemWidth', type: 'N', length: 10 },
         { index: 5, name: 'readOnly', label: 'readOnly', type: 'B' },
         { index: 6, name: 'required', label: 'required', type: 'B'}]
     },
     { name: 'DBComboSelect', description: 'DBDBComboSelect', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true },
         { index: 2, name: 'popupWidth', label: 'popupWidth', type: 'N', length: 10 },
         { index: 3, name: 'popupHeight', label: 'popupHeight', type: 'N', length: 10 },
         { index: 5, name: 'textReadOnly', label: 'textReadOnly', type: 'B' },
         { index: 6, name: 'showStyle', label: 'showStyle', type: 'S', length: 10, defaultValue:'auto'}]
     },
     { name: 'DBDatePicker', description: 'DBDatePicker', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true },
         { index: 2, name: 'popupWidth', label: 'popupWidth', type: 'N', length: 10 },
         { index: 3, name: 'popupHeight', label: 'popupHeight', type: 'N', length: 10 },
         { index: 5, name: 'textReadOnly', label: 'textReadOnly', type: 'B' },
         { index: 5, name: 'minDate', label: 'minDate', type: 'D' },
         { index: 6, name: 'maxDate', label: 'maxDate', type: 'D'}]
     },
     { name: 'DBAutoComplete', description: 'DBAutoComplete', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'field', label: 'field', type: 'S', length: 20, required: true },
         { index: 2, name: 'minChars', label: 'minChars', type: 'N', length: 10 },
         { index: 3, name: 'minDelay', label: 'minDelay(ms)', type: 'N', length: 10 },
         { index: 4, name: 'beforePopulate', label: 'beforePopulate', type: 'S', length: 20 },
         { index: 5, name: 'onGetFilterField', label: 'onGetFilterField', type: 'S', length: 20 },
         { index: 6, name: 'filterMode', label: 'filterMode', type: 'S', length: 10, defaultValue: 'start'}]
     },
     { name: 'DBChart', description: 'DBChart', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'chartUrl', label: 'chartUrl', type: 'S', length: 20, required: true },
         { index: 2, name: 'chartType', label: 'chartType', type: 'S', length: 10 },
         { index: 3, name: 'chartTitle', label: 'chartTitle', type: 'S', length: 10 },
         { index: 4, name: 'categoryField', label: 'categoryField(X axis)', type: 'S', length: 20, required: true },
         { index: 5, name: 'valueField', label: 'valueField(Y axis)', type: 'S', length: 20, required: true },
         { index: 6, name: 'onlySelected', label: 'onlySelected', type: 'B' },
         { index: 7, name: 'legendPos', label: 'legendPos', type: 'S', length: 10}]
     },
     { name: 'DBTreeView', description: 'DBTreeView', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'keyField', label: 'keyField', type: 'S', length: 20, required: true },
         { index: 2, name: 'parentField', label: 'parentField', type: 'S', length: 10 },
         { index: 3, name: 'displayFields', label: 'displayFields', type: 'S', length: 10 },
         { index: 5, name: 'hasCheckbox', label: 'hasCheckbox', type: 'B'},
         { index: 6, name: 'correlateCheck', label: 'correlateCheck', type: 'B' },
         { index: 6, name: 'expandLevel', label: 'expandLevel', type: 'N' },
         { index: 7, name: 'readOnly', label: 'readOnly', type: 'B' },
         { index: 8, name: 'onItemClick', label: 'onItemClick', type: 'S', length: 20 },
         { index: 8, name: 'onItemDblClick', label: 'onItemDblClick', type: 'S', length: 20 },
         { index: 8, name: 'onCreateContextMenu', label: 'onCreateContextMenu', type: 'S', length: 20 },
         { index: 4, name: 'iconClassField', label: 'iconClassField', type: 'S', length: 20 },
         { index: 9, name: 'onGetIconClass', label: 'onGetIconClass', type: 'S', length: 20}]
     },
     { name: 'DBPageBar', description: 'DBPageBar', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'showPageSize', label: 'showPageSize', type: 'B' },
         { index: 2, name: 'showGotoButton', label: 'showGotoButton', type: 'B' },
         { index: 3, name: 'pageSizeList', label: 'pageSizeList', type: 'S', length: 20 }]
     },
     { name: 'DBInspector', description: 'DBInspector', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'columnCount', label: 'columnCount', type: 'N' },
         { index: 2, name: 'rowHeight', label: 'rowHeight', type: 'N' }]
     },
     { name: 'DBEditPanel', description: 'DBEditPanel', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'columnCount', label: 'columnCount', type: 'N', length: 10 },
         { index: 2, name: 'labelGap', label: 'labelGap', type: 'N', length: 10 },
         { index: 3, name: 'columnGap', label: 'columnGap', type: 'N', length: 10 },
         { index: 4, name: 'columnWidth', label: 'columnWidth', type: 'N', length: 10 },
         { index: 5, name: 'rowHeight', label: 'rowHeight', type: 'N', length: 10 },
         { index: 6, name: 'onlySpecifiedFields', label: 'onlySpecifiedFields', type: 'B' },
         { index: 7, name: 'fields', label: 'fields', type: 'S', length: 20}]
     },
     { name: 'DBTable', description: 'DBTable', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'fixedRows', label: 'fixedRows', type: 'N', length: 10 },
         { index: 2, name: 'fixedCols', label: 'fixedCols', type: 'N', length: 10 },
         { index: 3, name: 'rowHeight', label: 'rowHeight', type: 'N', length: 10 },
         { index: 4, name: 'hasSeqCol', label: 'hasSeqCol', type: 'B' },
         { index: 5, name: 'hasSelectCol', label: 'hasSelectCol', type: 'B' },
         { index: 6, name: 'readOnly', label: 'readOnly', type: 'B' },
         { index: 7, name: 'hideHead', label: 'hideHead', type: 'B' },
         { index: 8, name: 'disableHeadSort', label: 'disableHeadSort', type: 'B' },
         { index: 9, name: 'onlySpecifiedCol', label: 'onlySpecifiedCol', type: 'B' },
         { index: 9, name: 'noborder', label: 'noborder', type: 'B' },
         { index: 10, name: 'selectBy', label: 'selectBy', type: 'S', length: 20 },
         { index: 11, name: 'onRowClick', label: 'onRowClick', type: 'S', length: 20 },
         { index: 12, name: 'onRowDblClick', label: 'onRowDblClick', type: 'S', length: 20 },
         { index: 13, name: 'onSelect', label: 'onSelect', type: 'S', length: 20 },
         { index: 14, name: 'onSelectAll', label: 'onSelectAll', type: 'S', length: 20 },
         { index: 15, name: 'onCustomSort', label: 'onCustomSort', type: 'S', length: 20 },
         { index: 16, name: 'onFillRow', label: 'onFillRow', type: 'S', length: 20 },
         { index: 17, name: 'onFillCell', label: 'onFillCell', type: 'S', length: 20 },
         { index: 18, name: 'treeField', label: 'treeField', type: 'S', length: 20 },
         { index: 19, name: 'totalFields', label: 'totalFields', type: 'S', length: 20 },
         { index: 20, name: 'columns', label: 'columns', type: 'V', length: 10}]
     },
     { name: 'TabControl', description: 'TabControl', fields:
        [{ index: 0, name: 'dataset', type: 'S', label: 'dataset', length: 20, required: true },
         { index: 1, name: 'selectedIndex', label: 'selectedIndex', type: 'N', length: 10 },
         { index: 2, name: 'newable', label: 'newable', type: 'B' },
         { index: 3, name: 'closable', label: 'closable', type: 'B' },
         { index: 4, name: 'onAddTabItem', label: 'onAddTabItem', type: 'S', length: 20 },
         { index: 5, name: 'onSelectedChanged', label: 'onSelectedChanged', type: 'S', length: 20 },
         { index: 6, name: 'onRemoveTabItem', label: 'onRemoveTabItem', type: 'S', length: 20 }]
     },
     { name: 'Calendar', description: 'Calendar', fields:
        [{ index: 0, name: 'value', type: 'D', label: 'value', length: 10, required: true },
         { index: 0, name: 'minDate', type: 'D', label: 'minDate', length: 10 },
         { index: 0, name: 'maxDate', type: 'D', label: 'maxDate', length: 20 },
         { index: 6, name: 'onDateSelected', label: 'onDateSelected', type: 'S', length: 20}]
     },
     { name: 'Window', description: 'Window', fields:
        [{ index: 0, name: 'caption', type: 'S', label: 'caption', length: 20, required: true },
         { index: 1, name: 'iconClass', label: 'iconClass', type: 'S', length: 20 },
         { index: 2, name: 'width', label: 'width', type: 'N', length: 10 },
         { index: 3, name: 'height', label: 'height', type: 'N', length: 10 },
         { index: 4, name: 'minWidth', label: 'minWidth', type: 'N', length: 10 },
         { index: 5, name: 'maxWidth', label: 'maxWidth', type: 'N', length: 10 },
         { index: 6, name: 'minHeight', label: 'minHeight', type: 'N', length: 10 },
         { index: 7, name: 'maxHeight', label: 'maxHeight', type: 'N', length: 10 },
         { index: 8, name: 'resizable', label: 'resizable', type: 'B' },
         { index: 9, name: 'minimizable', label: 'minimizable', type: 'B' },
         { index: 10, name: 'maximizable', label: 'maximizable', type: 'B' },
         { index: 11, name: 'closable', label: 'closable', type: 'B' },
         { index: 12, name: 'isCenter', label: 'isCenter', type: 'B' },
         { index: 13, name: 'onSizeChanged', label: 'onSizeChanged', type: 'S', length: 20 },
         { index: 14, name: 'onClosed', label: 'onClosed', type: 'S', length: 20 },
         { index: 15, name: 'onPositionChanged', label: 'onPositionChanged', type: 'S', length: 20 },
         { index: 16, name: 'onActive', label: 'onActive', type: 'S', length: 20 }]
     }
     ]; 
dsDatasetCfg.dataList(data);
delete data;
