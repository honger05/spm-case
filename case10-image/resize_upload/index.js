/**
 * Blob 二进制大文件
 */

function ResizeImageFile(file, maxWidth, maxHeight, callback) {
	var Img = new Image();
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	var urlCreator = window.URL || window.webkitURL;
	// dataURL = urlCreator.createObjectURL(blob);

	Img.onload = function() {
		if (Img.width > maxWidth || Img.height > maxHeight) {
			// eg: mw: 300, mh: 300. iw: 300, ih: 400.
			var maxRatio = Math.max(Img.width/maxWidth, Img.height/maxHeight);
			// 除以最大比例，得到缩小比例
			canvas.width = Img.width/maxRatio;
			canvas.height = Img.height/maxRatio;
		}
		else {
			canvas.width = Img.width;
			canvas.height = Img.height;
		}

		ctx.drawImage(Img, 0, 0, Img.width, Img.height, 0, 0, canvas.width, canvas.height);

		// $('body').append(canvas);

		callback(canvas.toDataURL());
	};

	try {
		Img.src = URL.createObjectURL(file);
	} 
	catch(err) {
		try {
			Img.src = window.webkitURL.createObjectURL(file);
		} 
		catch (ex) {
			console.error(ex.message);
		}
	}
}

function isImage(fileName) {
	var extension = fileName.substring(fileName.lastIndexOf('.')+ 1);
	var exts = ['jpg', 'png', 'gif', 'jdpg', 'emp'];
	var isExsit = exts.some(function(el) {
		return (el.toLowerCase() === extension);
	});
	if (!isExsit) {
		alert('请选择图片文件');
		return false;
	}
	return true;
}

function uploadImage(dataURL) {
	var fd = new FormData();
	var blob = dataURLtoBlob(dataURL);
	fd.append('image', blob);
	// 上传文件只需将文件加进来。
	// fd.append('file', file);
}

$('#upload').on('click', function() {
	var $clickObj = $(this);
	var $fileInput = $('<input type="file" />');

	$fileInput.on('change', function(e) {
		var file = e.target.files[0];
		if (!isImage(file.name)) {
			return;
		}
		$clickObj.text('正在上传...');
		ResizeImageFile(file, 200, 200, function(dataURL) {
			// 图片 用 ajax 把 dataURL（base64） 上传了 {data: dataURL} 就行了。
			// 图片太大的话 就需要用 Blob 、 Formdata 上传。
			$clickObj.text('重新上传');
			$clickObj.before('<img src="' + dataURL + '">');
			uploadImage(dataURL);
		});
	});

	$fileInput.click();
});


//////////////////////
// dataURL and Blob and Binary//
//////////////////////

//**dataURL to blob**
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

//**blob to dataURL**
function blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function(e) {callback(e.target.result);}
    a.readAsDataURL(blob);
}

function blobToBinary(blob, callback) {
	var fr = new FileReader();
	fr.onload = function(e) {
		callback(e.target.result);
	}
	fr.readAsBinaryString(blob);
}

function binaryToBlob(binary) {
	var bb = new BlobBuilder(); // BlobBuilder 老方法
	var arr = new Uint8Array(binary.length);
	for (var i = 0, len = binary.length; i < len; i++) {
		arr[i] = binary.charCodeAt(i);
	}
	bb.append(arr.buffer);

	return bb.getBlob();
}

function getImageBlob(url) {
	var r = new XMLHttpRequest();
	r.open('GET', url, false);
	r.overrideMimeType('text/pain; charset=x-user-defined');
	r.send(null);
	var blob = binaryToBlob(r.responseText);
	blob.name = blob.fileName = url.substring(url.lastIndexOf('') + 1);
	blob.fileType = 'image/jpeg'; // "image/octet-stream"
	return blob;
}

//test:
var blob = dataURLtoBlob('data:text/plain;base64,YWFhYWFhYQ==');

blobToDataURL(blob, function(dataurl){
    console.log(dataurl);
});

blobToBinary(blob, function(binaryString) {
	console.log(binaryString)
})