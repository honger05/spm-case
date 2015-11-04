var gridEl = document.getElementById('grid');

/////////////////
// 图片加载完了才执行回调 //
/////////////////
imagesLoaded(gridEl, function() {
	// 再执行 砌墙式布局;
	new Masonry(gridEl, {
		itemSelector: 'li'
		// transitionDuration : 0
	});
});