
var $ = require('jquery');

// 普通标签页
var Tabs = require('arale-switchable').Tabs;

new Tabs({
	element: '#tab-demo-1',
	triggers: '.ui-switchable-nav li',
	panels: '.ui-switchable-content div',
	activeIndex: 2,
	triggerType: 'click',
	effect: 'fade'
});

// Slide 卡盘轮播
var Slide = require('arale-switchable').Slide;

new Slide({
	element: '#slide-demo-1',
	effect: 'fade',
	interval: 3000
});

new Slide({
    element: '#slide-demo-2',
    effect: 'fade',
    activeIndex: 1
}).render();

var slide = new Slide({
	element: '#slide-demo-3',
	effect: 'scrollx',
	hasTriggers: false
})

$("#slide-demo-3 #prev").click(function(e) {
    e.preventDefault();
    slide.prev();
});

$("#slide-demo-3 #next").click(function(e) {
    e.preventDefault();
    slide.next();
});

new Slide({
    element: '#slide-demo-4',
    effect: 'fade',
    activeIndex: 1
}).render();


// Accordion 手风琴
var Accordion = require('arale-switchable').Accordion;
new Accordion({
    element: '#accordion-demo-1'
}).render();


// Carousel 旋转木马
var Carousel = require('arale-switchable').Carousel;
new Carousel({
    element: '#carousel-demo-2',
    easing: 'easeOutStrong',
    effect: 'scrollx',
    autoplay: true
}).render();