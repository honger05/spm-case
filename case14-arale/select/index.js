
require('alice-select');

var Select = require('arale-select');

new Select({
    trigger: '#example1'
}).render();


// trigger 为任意 DOM，但必须传入 model 数据
new Select({
    trigger: '#example2',
    model: [
        {value:'option1', text:'option1'},
        {value:'option2', text:'option2', selected: true},
        {value:'option3', text:'option3', disabled: true}
    ]
}).render();



//  级联操作 通过 change 事件监听切换，通知其他 select 更新数据
var a1 = new Select({
    trigger: '#exampel6-1',
    triggerTpl: '<a href="#"><span data-role="trigger-content"></span><i class="iconfont" title="下三角形">&#xF03C;</i></a>',
    width: 100
}).on('change', function(target) {
    var type = target.attr('data-value');
    var model = parseProv(type);
    console.log(model);
    a2.syncModel(model);
});

var a2 = new Select({
    trigger: '#exampel6-2',
    model: parseProv('WATER'),
    width: 100,
    maxHeight: 300
}).on('change', function(target) {
    var prov = target.attr('data-value');
    var model = parseCity(a1.get('value'), prov);
    a3.syncModel(model);
});

var a3 = new Select({
    trigger: '#exampel6-3',
    model: parseCity('WATER'),
    width: 100,
    maxHeight: 300
});

a1.render();
a2.render();
a3.render();