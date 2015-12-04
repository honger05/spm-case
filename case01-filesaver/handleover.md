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

1.  `clui`:

## 五、修改的css

## 六、建议

## 七、其它系统、官网、html5Plus

### 1. 官网

### 2. html5Plus