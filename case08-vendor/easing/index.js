require('arale-easing');

$('#demo').animate({
        height: 'toggle'
    }, {
    duration: 5000,
    specialEasing: {
        height: 'bounceOut' // 直接使用扩展的平滑函数名就好
    },
    complete: function() {
        $(this).after('<div>Animation complete.</div>');
    }
});

$('#demo1').animate({
        width: '411'
    }, {
    duration: 5000,
    specialEasing: {
        width: 'backOut' // 直接使用扩展的平滑函数名就好
    },
    complete: function() {
        $(this).after('<div>Animation complete.</div>');
    }
});

// animate 只有数字值可用
$('#demo2').animate({
        width: '12',
        height: '22',
        color: 'red'
      },{
      	duration: 2000
});

// $(selector).animate(styles,speed,easing,callback)
$('#demo3').animate({width: '12'}, 2000, 'bounceOut', function() {
	$(this).after('<div>Animation complete.</div>');

	if (!$('#demo3').is(':animated')) {
        console.log('demo3 is animated complete');
    }
});

// 判断是否在动画中
if ($('#demo3').is(':animated')) {
    console.log('demo3 is animating');
    // 停止动画
    $(this).stop(true, true);
}

// 切换显示隐藏
// jquery 1.9 把 toggle 方法删除了。jQuery Migrate（迁移）插件可以恢复此功能。
$(".test h3").toggle(
    function() {
        $(this).next(".text").animate({height: 'toggle', opacity: 'toggle'}, "slow", "bounceOut");
        $(this).addClass("arrow");
    },
    function() {
        $(this).next(".text").animate({height: 'toggle', opacity: 'toggle'}, "slow", "swing");
        $(this).removeClass("arrow");
    }
);
