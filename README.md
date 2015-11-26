# spm-case
some package which base on spm3.6 .

## Prepare

````bash
$ npm install spm -g
````

Make sure your spm version is 3.6.x .

## Usage

````bash
# !-- 1. enter directory
$ cd case01-filesaver

# !-- 2. debug
$ spm server
$ open http://127.0.0.1:8000/

# !-- 3. build
$ spm build
$ open dist/index.html
````

## cool website

### 设计类

* [smashingmagazine](http://www.smashingmagazine.com/)
* [codrops](http://tympanus.net/codrops/)
* [alltemplateneeds](http://www.alltemplateneeds.com/)
* [wallpaperswide](http://wallpaperswide.com/)
* [tooopen](http://www.tooopen.com/)

### 工具类

* [heroku](https://www.heroku.com/)
* [travis-ci](https://travis-ci.org/)
* [coveralls](https://coveralls.io/)
* [jspref benchmark](http://jsperf.com/)
* [regexp test](http://refiddle.com/)
* [can I use](http://caniuse.com/)
* [paho MQTT](http://www.eclipse.org/paho/clients/js/)

### 程序博客类

* [TasteJS - Medium](https://medium.com/%40tastejs)
* [slideshare - nzakas](http://www.slideshare.net/nzakas/enterprise-javascript-error-handling-presentation)
* [nczonline](https://www.nczonline.net/blog/2009/04/28/javascript-error-handling-anti-pattern/)
* [techrepublic](http://www.techrepublic.com/blog/australian-technology/error-handling-in-javascript-rarely-done-often-needed/)

### 学习资源

* [egghead](https://egghead.io/)
* [leanpub](https://leanpub.com/)

## sublime 配置

````json
{
	"caret_style": "phase",
	"color_scheme": "Packages/User/SublimeLinter/Flatland Dark (SL).tmTheme",
	"font_size": 11,
	"highlight_line": true,
	"highlight_modified_tabs": true,
	"ignored_packages":
	[
		"Vintage"
	],
	"margin": 0,
	"tab_size": 2,
	"theme": "Nexus.sublime-theme"
}

// or

{
	"caret_style": "phase",
	"color_scheme": "Packages/User/SublimeLinter/Tomorrow-Night (SL).tmTheme",
	"font_size": 11,
	"highlight_line": true,
	"highlight_modified_tabs": true,
	"ignored_packages":
	[
		"Vintage"
	],
	"margin": 0,
	"tab_size": 2,
	"theme": "Nexus.sublime-theme"
}
````

## web font

* Helvetica arial "Helvetica Neue" "Trebuchet MS" sans-serif


## Linux 命令

````bash
`netstat -ano|findStr "8000"`  // 查看占用端口号(8000)的进程
`ps -ef` // 查看正在活动的进程
`ps -ef |grep abc`  // 查看含有"abc"的活动进程
`ps -ef |grep -v abc` // 查看不含abc的活动进程
`kill -9 pid` // 杀死 pid 进程
````




