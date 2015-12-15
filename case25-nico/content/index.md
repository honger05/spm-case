# Hui

- pubdate: 2012-12-12

Learning and Practice on Arale.

---------------

<link rel="stylesheet" href="dist/asset/alice/dialog.css">
<script src="dist/lib/jquery/jquery.js"></script>
<script src="dist/lib/handlebars/handlebars.js"></script>
<script src="dist/core.js"></script>
<script src="dist/hui.js"></script>

## 带有默认样式的对话框

<input type="button" id="trigger1" value="默认样式对话框" />

````js
var ConfirmBox = Hui.Dialog.ConfirmBox;

var cb1 = new ConfirmBox({
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
````

## ConfirmBox: 自定义按钮

<input type="button" id="trigger2" value="自定义按钮对话框" />

````js
var cb2 = new ConfirmBox({
    trigger: '#trigger2',
    title: '我真是标题啊',
    message: '我是内容 我是内容',
    confirmTpl: '<button>确定</button>',
    cancelTpl: '<button>取消</button>'
});
````

## ConfirmBox 的静态方法 `常用`

<input type="button" id="trigger12" value="ConfirmBox.alert()" />
<input type="button" id="trigger13" value="ConfirmBox.confirm()" />
<input type="button" id="trigger13-1" value="ConfirmBox.confirm() with onCancel" />
<input type="button" id="trigger14" value="ConfirmBox.show()" />

````js

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
````