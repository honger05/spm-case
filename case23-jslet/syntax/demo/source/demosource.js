function showSource(){
	var srcFrame = document.getElementById('jsletsource');
	if(srcFrame.style.display == 'none')
		srcFrame.style.display = '';
	else
		srcFrame.style.display = 'none';
}
(function(){
	var doc = document.location.href,
	    k = doc.lastIndexOf('.'),
	    srcDoc = doc.substring(0, k) + '-source' + doc.substring(k);


	var jsTags = document.getElementsByTagName('script'),
	    url = jsTags[jsTags.length - 1].src;
	k = url.indexOf("?height=");
	var height = url.substring(k+8);
	if(height)
	  height = parseInt(height) + 'px';
	else
	  height = '200px';
	document.write('&nbsp;&nbsp;<a href="javascript:void(0)" onclick="showSource();">Source Code Snippet </a>');
	document.write('<fieldset id="jsletsource" style="display:none;"><iframe src="'+srcDoc+'" style="width:100%;height:'+height+';border:none" frameborder="0"></iframe></fieldset>');
})();
