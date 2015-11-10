
var Calendar = require('arale-calendar');

var date = new Calendar.DateColumn({});
date.show();

var month = new Calendar.MonthColumn({});
month.show();

var year = new Calendar.YearColumn({range: [2012]});
year.show();

// 最简示例，没有任何特殊要求：
new Calendar({trigger: '#date-nothing'});

// 你也可以自己传入语言：
var lang = {
    'Su': '日', 'Mo': '月', 'Tu': '火', 'We': '水', 'Th': '木',
    'Fr': '金', 'Sa': '土',
    'Jan': '1月', 'Feb': '2月', 'Mar': '3月', 'Apr': '4月',
    'May': '5月', 'Jun': '6月', 'Jul': '7月', 'Aug': '8月',
    'Sep': '9月', 'Oct': '10月', 'Nov': '11月', 'Dec': '12月'
};
new Calendar({
    trigger: '#date-lang',
    lang: lang,
    align: {
      selfXY: [0, 0],
      baseElement: '#date-lang',
      baseXY: [0, '100%+20']
    }
});


// 设定初始值，比如初始值为世界末日：
new Calendar({trigger: '#date-focus-1', focus: '2012-12-12'});


// 另外，如果 input 框中有值，会将此值做为初始值：
new Calendar({trigger: '#date-focus-2'});


// 比如只能选择 2012-12-06 到 2012-12-20 之间的日期：
var cal = new Calendar({
    trigger: '#date-disable-1',
    range: ['2012-12-06', '2012-12-20']
});



// 比如只能选择 2012-12-25 之前的日期：
var cal = new Calendar({
    trigger: '#date-disable-2',
    range: [null, '2012-12-25']
});


// 比如不能选择周二的日期：
var cal = new Calendar({
    trigger: '#date-disable-3',
    range: function(date) {
        if (date.day) {
            return date.day() != 2;
        }
        return true;
    }
});


// 默认的输入输出格式为 YYYY-MM-DD，你可以设置为任何自己想要的格式，比如： MM/DD/YYYY。
new Calendar({trigger: '#date-format', format: 'MM/DD/YYYY'});


// 默认一周的开始为周日，你可以设置为其它的星期，比如周三。
// new Calendar({trigger: '#date-startday', startDay: 2});
// new Calendar({trigger: '#date-startday', startDay: 'Wed'});
new Calendar({trigger: '#date-startday', startDay: 'Wednesday'});


// 当用户选择了日期后，日历会自动隐藏。也许这并不是你想要的。
new Calendar({trigger: '#date-not-hide', hideOnSelect: false});


// 输入框不是触发点。
new Calendar({trigger: '#date-trigger', output: "#date-output"});


// 甚至都没有输入框
new Calendar({trigger: '#date-trigger-2', output: '#date-output-2'});


// Double Calendar
var t1 = '2012-01-01';
var t2 = '2015-01-01';
var c1 = new Calendar({trigger: '#start-cal', range: [t1, null]})
var c2 = new Calendar({trigger: '#end-cal', range: [null, t2]})
console.log(c1.get('focus').format('YYYY-MM-DD'), c2.get('focus').format('YYYY-MM-DD'));

c1.on('selectDate', function(date) {
    console.log(c1.get('focus').format('YYYY-MM-DD'), c2.get('focus').format('YYYY-MM-DD'));
    c2.range([date, t2]);
});

c2.on('selectDate', function(date) {
    c1.range([t1, date]);
});


// 实现一个年月历
// var cal = new Calendar({
//     trigger: "#year-month-cal",
//     events: {
//       'click [data-role=current-month]': function(ev) {
//         this.renderContainer('months');
//       },
//       'click [data-role=current-year]': function(ev) {
//         this.renderContainer('years');
//       }
//     }
// }).on('show selectYear', function() {
//     this.renderContainer('months');
// }).on('selectMonth', function(date) {
//     this.hide();
//     this.output(date.format('YYYY-MM'));
// });


