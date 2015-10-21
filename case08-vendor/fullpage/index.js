var move = require('move');

$('#fullpage').fullpage({
	anchors:['firstPage', 'secondPage', 'thirdPage', 'fourthPage'],
	// menu: '#myMenu',
	sectionsColor: ['#08c', '#4BBFC3', '#7BAABE', '#ddd'],
	loopTop: false,
	loopBottom: false,
	easing: "easeInOutBounce",
	scrollBar: false,
	navigation: true,
	navigationTooltips: ['firstSlide', 'secondSlide', 'thirdSlide', 'fourthSlide'],
	showActiveTooltip: true,
	slidesNavigation: true,
	scrollOverflow: false,
	
	afterLoad: function(anchorLink, index) {

		switch(index){
			case 1:
				
				break;
			case 2:
				move('.se2 h1')
					.set('margin-left', '0')
					.end();
				move('.se2 p')
					.set('margin-top', '0')
					.end();
				break;
			case 3:
				
				break;
			case 4:
				
				break;	
			// default:
		}
	},

	onLeave: function(index, nextIndex, direction) {
				switch(index){
			case 1:
				
				break;
			case 2:
				move('.se2 h1')
					.set('margin-left', '100px')
					.end();
				move('.se2 p')
					.set('margin-top', '100px')
					.end();
				break;
			case 3:
				
				break;
			case 4:
				
				break;	
			// default:
		}
	}
});