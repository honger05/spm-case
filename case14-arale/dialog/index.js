
require('./dialog.css');

var $ = require('jquery');

var Dialog = require('arale-dialog');

new Dialog({
  trigger: '#example1',
  height: '100px',
  effect: 'fade',
  hasMask: false,
  align: {
    baseXY: ['50%', 0],
    selfXY: ['50%', 0]
  },
  content: '传入了字符串'
});

new Dialog({
  trigger: '#example2',
  height: 200,
  align: {
    baseElement: '#example2',
    baseXY: [0, '100%'],
    selfXY: [0, 0]
  },
  content: $('#example2-dom')
});

new Dialog({
	trigger: '#example3',
	closeTpl: '点我可以关闭对话框',
	content: '<div style="padding:20px">传入了 html 标签, 按 ESC 将无法关闭这个对话框</div>'
}).undelegateEvents(document, 'keyup.esc');

new Dialog({
	trigger: '#example4',
	initialHeight: 150,
	content: 'http://www.youku.com'
}).on('complete:show', function() {
    console.log('www.youku.com 完全载入成功！');
});


// ===============================
//  iframe 的 url 可以根据 trigger 变化
new Dialog({
	trigger: '#example5 button',
	height: 400
}).before('show', function() {
	this.set('content', this.activeTrigger.attr('data-src'));
});

// ==================================
// 当然除了 iframe，同样可以动态修改 content
new Dialog({
    trigger: '#example6 button',
    height: '160px',
    width: '160px'
}).before('show',function() {
    var img = '<img src="https://i.alipayobjects.com/combo.jpg?d=apps/58&t='+ this.activeTrigger.attr('data-id') + '" />';
    this.set('content', img);
});

new Dialog({
    content: '<div style="padding:50px">没有 trigger，直接显示出来</div>'
}).show();


// ===============================
// ConfirmBox
var ConfirmBox = Dialog.ConfirmBox; 
var cb = new ConfirmBox({
    trigger: '#trigger1',
    title: '我真是标题啊',
    message: '我是内容 我是内容',
    onConfirm: function() {
        var that = this;
        this.set('title', '三秒后关闭对话框');
        this.set('message', '不要啊！！');
        setTimeout(function() {
            that.hide();
        }, 3000);
    }
});

// =================================
// ConfirmBox 的静态方法 
$('#trigger12').click(function() {
    ConfirmBox.alert('静态方法ConfirmBox.alert');
});

$('#trigger13').click(function() {
    ConfirmBox.confirm('静态方法ConfirmBox.confirm', '自定义标题', function() {
        alert('点击了确定按钮');
    });
});

$('#trigger13-1').click(function() {
    ConfirmBox.confirm('静态方法ConfirmBox.confirm with onCancel', '自定义标题', function() {
        alert('点击了确定按钮');
    }, function() {
        alert('点击了取消按钮');
    });
});

$('#trigger14').click(function() {
    ConfirmBox.show('只是显示一些信息，右上角关闭');
});

// =========================================
// ConfirmBox 的静态方法自定义参数
$('#triggers1').click(function() {
    ConfirmBox.alert('静态方法ConfirmBox.alert', function() {
        alert('点击了确定按钮');
    }, {
        beforeHide: function() {
            alert('点击了取消按钮');
        },
        width: 300
    });
});

$('#triggers2').click(function() {
    ConfirmBox.confirm('静态方法ConfirmBox.confirm', '自定义标题', function() {
        alert('点击了确定按钮');
    }, {
        beforeHide: function() {
            alert('点击了取消按钮');
        },
        title: '改过的自定义标题',
        closeTpl: '×'
    });
});

$('#triggers3').click(function() {
    ConfirmBox.show('静态方法ConfirmBox.show', function() {
        alert('点击了关闭按钮');
    }, {
        hasMask: false
    });
});


// ============================
// 
new Dialog({
  trigger: '#trigger-btn',
  autoFit: false,
  content: 'http://spmjs.io/docs/arale-dialog-iframe-helper/examples/index.html'
});