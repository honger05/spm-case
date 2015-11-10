
var AutoComplete = require('arale-autocomplete');

new AutoComplete({
    trigger: '#acTrigger1',
    dataSource: ['abc', 'abd', 'abe', 'acd'],
    width: 150
}).render();