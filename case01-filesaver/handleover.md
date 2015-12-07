
# Work Handleover -- honger

...

## 一、系统第三方组件

1.  `seajs` 模块加载器
2.  `bui` 一套 UI 框架
3.  `plupload` 上传插件
4.  `moment` 日期插件
5.  `handlebars` 模板引擎
6.  `emqttd` 推送消息插件
7.  `hightcharts` 图表插件
8.  `underscore` 工具类
9.  `xlsx` excel 文件 前端处理 上传解析，下载等功能的插件
10.  `ckeditor` 富文本编辑器

* * *

## 二、组件用处,修改，及其它

1.  `seajs` : 用在所有 html 页面的 `</body>` 前引用。来启动模块加载器。

2.  `bui`:  是一个强大的 UI 库，但是系统中只在 主框架页 中用了 `navtab` 导航标签。和权限管理中的树组件，和 `Dialog` 弹出框组件。_由于大量的bui文件存在系统并未使用的功能。升级和优化的时候，可以对此库，进行合理的整理。_3.  `plupload`: 所有上传都使用的这个插件。

4.  `moment`: 在计算一些时间的时候使用了这个工具类，比如计算前一个月的日期是多少。

5.  `handlebars`: 在一些 ui 组件中使用，提供简洁的 html 模板。

6.  `emqttd`: 基于 emqtt 的消息服务组件。与 Terry 写的后台代码相呼应。

7.  `hightcharts`:  重庆同事在 dms 中用过，目前并未有太多图表类的需求。_这是一个很棒的图表插件，建议使用_

8.  `underscore`: 此工具丰富了 Array Function Object 的功能，非常适合处理一些业务逻辑，但用的人少。_建议使用_

9.  `xlsx`: 用在前端的 excel 导入导出。参考： [https://github.com/SheetJS/js-xlsx](https://github.com/SheetJS/js-xlsx)

* * *

## 三、我写的代码

1.  `clui` 全局的系统 UI 接口。
2.  `commonjs` 全局的工具类
3.  `bizcommon` 全局的业务工具类
4.  `filter` 过滤功能
5.  `asset` 静态资源, 包括 css 、 images

## 四、代码作用、目的、用处

### 1. clui

`clui` 是系统唯一的 UI 接口，任何与 UI 有关的代码，都必须由它来调度。它还集成了很多样式代码，任何新功能都必须引用它。这样做的一个好处就是，开发人员的使用成本降低了。为了解决不必要的资源加载，所以使用了 promise 和 seajs 的异步加载。

例如：

```js
Clui.previewImage = function(url){

    // 返回 promise 对象。
    return $.Deferred(function(dfd){

        // 异步加载文件
        require.async('bui/overlay',function(Overlay){
            var config = $.extend({
                title:'图片预览',
                width:600,
                height:450,
                bodyContent:'<img src="'+url+'">',
                buttons:[]
            });
            
            var imgDialog = new Overlay.Dialog(config);
            imgDialog.show();
            
            // 触发 promise 的成功状态，并把 Dialog 实例传出去
            dfd.resolve(imgDialog);
        });
    });
}
```

** 注意： **

1. 任何公共 UI 的调度都必须由 clui 来完成。

2. 在 cl-ued 的 src 目录 中，把很多单独功能的小模块拆成小文件，方便管理和维护。 src 目录下的代码并不能直接使用，因为他们是 commonjs 规范的。必须由 [spm-sea](https://github.com/spmjs/spm-sea) 工具将其打包到 dist 目录中才能使用。Makefile 的作用是调整目录结构。

#### 1.1 列举小模块

1. code.js ：一些公共的提示代码，未进行有效整理。可以优化。
2. contextmenu.js : 右键菜单代码。在 打印设置功能 中使用。
3. css.js : 管理加载 css 的代码。
4. overlay.js : 弹出组件，系统的 alert show confirm 等
5. tab.js ：标签页组件。

### 2. commonjs

`commonjs` 处于依赖链最底层的模块。要保证它是完全不依赖别的模块。它由一下 6 个小模块组成。可以被任何模块依赖。

1. utils ：工具方法，提供一些有用的工具类。
2. drag ： 拖动方法。
3. synchronizer ： 同步器
4. client ： 客户端浏览器版本检查工具
5. emqttd ： 消息组件
6. ENI ：excel 文件 导入导出 

它们也都是 commonjs 规范的，不能直接使用，处理方法同 clui。

### 3. bizcommon

`bizcommon` 公共业务组件，需要保证他们只能被业务功能引用。它由 4 个小模块组成。

1. bizutils : 业务工具方法
2. bizcache : 浏览器缓存
3. datasetfactory : 数据集生产工厂
4. userPref : 用户偏好设置

它们也都是 commonjs 规范的，不能直接使用，处理方法同 clui。

### 4. filter

`filter` 被当做过滤器使用。主要处理一些全局的方法。例如 jslet 全局报错，防止 Backbspace 倒退页面等。

它也是 commonjs 规范的，不能直接使用，处理方法同 clui。

### 5. asset

`asset` 就是系统样式资源存放的目录。

1. `main.css` 将 bootstrap, bootstap-theme 和 font-awesome 等库打包在一起。节省下载资源。在 css.js 中被加载
2. `base.css` 系统基础样式，调整浏览器默认样式，以实现各浏览器统一。还提供一些工具 class ，所有页面都会在第一个 link 中加载它。
3. `resetui.css` 所有对 bootstrap jslet 等库的修改，都在这个样式表中设置。
4. `index.css` 这个样式表只在首页框架中被引用。

`theme` 目录下有不同的样式主题。目前是三个。建议进行扩充和优化。

## 五、修改的css

在 `resetui.css` 中可以看到所有被修改的样式。没有在第三方库中直接修改。保持第三方库干净，提高可维护性。

## 六、建议

一些建议意见已在上述类容中提出。另推荐使用 markdown 来写文档。


## 七、其它系统、官网、html5Plus

### 1. 官网

[官网后台](http://www.chenlaisoft.com/cmscp/index.do ) 

登陆后台后，在文件一栏中点击下载，就可以将所有代码下载下来。我目前使用的是在线编辑的方式。

官网是使用 jspxcms 系统，套用模板的方式做的。

首先是添加栏目，栏目会默认对应 html 模板，也可以自己自定义。定义好栏目之后，就可以往里面添加文档了。

它的层级是这样的

````js
index(首页) ==> covers(封面页) ==> list(列表页) ==> info(详细页)
````

查看 [jspxcms](http://www.jspxcms.com/) 了解更多。


### 2. html5Plus

html5Plus 是一个快速开发 app 的框架，利用原生 webview 来做转场动画。它可以让你像写 html 一样，写 app。在 Android 低端机上效果较差，它确实提高了开发效率，但是 webview 增多之后对手机的消耗确实比较大。这是要在开发效率和性能上权衡一下。

在开发的时候，调试的办法 

1. [Android 调试](http://ask.dcloud.net.cn/docs/#http://ask.dcloud.net.cn/article/69)
2. [IOS 调试](http://ask.dcloud.net.cn/docs/#http://ask.dcloud.net.cn/article/143)

app 优化 [技巧](http://ask.dcloud.net.cn/docs/#http://ask.dcloud.net.cn/article/25)

[常见开发问题](http://ask.dcloud.net.cn/docs/#http://ask.dcloud.net.cn/article/107)

参考资料

[开发文档](http://ask.dcloud.net.cn/docs/#http://ask.dcloud.net.cn/article/89)
[html5+ API](http://www.dcloud.io/docs/api/zh_cn/webview.shtml#plus.webview.WebviewStyle)
