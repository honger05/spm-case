	$(function(){
		var len = $('.sec').length;
		$('.sec').each(function( i ){
			var shade = parseInt((i/len) * 255);
			$(this).css({
				'-webkit-transform': 'rotate(' + i + 'deg)',
				'background': 'rgba('+shade+','+shade+','+shade+',1)',
				'width': parseInt(window.innerHeight/2)+'px',
				'left': '50%',
				'margin-left': -parseInt(window.innerHeight/2)/2+'px'
			}).animOnScroll({
				animations: [
					{ 
						from: { rotate: 0, top: 0, left: 0 },
						to: { rotate: 190 + (10*i), top: 0 },
						startOn: 0, 
						endOn: 5000-window.innerHeight}
				]
			});
		});
	});