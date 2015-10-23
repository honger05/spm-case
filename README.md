# spm-case
some package which submit on spm3.6 .

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

* [codrops -- html5 + css3 效果](http://tympanus.net/codrops/)
* [alltemplateneeds -- html + psd 模板](http://www.alltemplateneeds.com/)
* [中国专业素材网](http://www.tooopen.com/)


### sublime 配置

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
````
