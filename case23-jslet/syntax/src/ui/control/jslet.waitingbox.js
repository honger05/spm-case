/* ========================================================================
 * Jslet framework: jslet.waitingbox.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class WaitingBox. Example:
 * <pre><code>
 *   var wb = new jslet.ui.WaitingBox(document.getElementById("test"), "Gray", true);
 *	wb.show("Please wait a moment...");
 * 
 * </code></pre>
 * @param {Html Element} container The container which waitingbox reside on.
 * @param {String} overlayColor Overlay color
 * @param {Boolean} tipsAtNewLine Tips is at new line or not. If false, tips and waiting icon is at the same line.
 */
jslet.ui.WaitingBox = function (container, overlayColor, tipsAtNewLine) {
	var overlay = new jslet.ui.OverlayPanel(container);
	var s = '<div class="jl-waitingbox"><b class="jl-waitingbox-icon"></b>';
		s += '<span id="tips"></span></div>';

	jQuery(overlay.overlayPanel).html(s);

	/**
	 * Show wating box
	 * 
	 * @param {String} tips Tips
	 */
	this.show = function (tips) {
		var p = overlay.overlayPanel,
			box = p.firstChild,
			tipPanel = box.childNodes[1];
		tipPanel.innerHTML = tips ? tips : '';
		var jqPnl = jQuery(p),
			ph = jqPnl.height(),
			pw = jqPnl.width();

		setTimeout(function () {
			var jqBox = jQuery(box);
			box.style.top = Math.round((ph - jqBox.height()) / 2) + 'px';
			box.style.left = Math.round((pw - jqBox.width()) / 2) + 'px';
		}, 10);

		overlay.show();
	};

	/**
	 * Hide waiting box
	 */
	this.hide = function () {
		overlay.hide();
	};

	this.destroy = function () {
		overlay.overlayPanel.innerHTML = '';
		overlay.destroy();
	};
};
