

/**
 * uptoken: http://jsfiddle.net/gh/get/extjs/4.2/icattlecoder/jsfiddle/tree/master/uptoken
 * module.exports = {
	    'ACCESS_KEY': 'zG6qE-4OACirZtT652SFVXgsM0Qg8dhsfISHPONE',
	    'SECRET_KEY': 'nTv-m_wWGzja4bWKdPvFyK8EmOKD93EyvuFCWyTQ',
	    'Bucket_Name': 'honger05',
	    'Port': 19110,
	    'Uptoken_Url': '/uptoken',
	    'Domain': 'http://7xlt9g.com1.z0.glb.clouddn.com/'
	 };
 * @type {[type]}
 */
var uploader = Qiniu.uploader({
	runtimes: 'html5,flash,html4',
	browse_button: 'pickfiles',
  container: 'container',		
  auto_start: true,
  domain: 'http://7xlt9g.com1.z0.glb.clouddn.com/',
  uptoken: 'zG6qE-4OACirZtT652SFVXgsM0Qg8dhsfISHPONE:OH7zRYErJzuW_mR0OigfHWWxHL8=:eyJzY29wZSI6ImhvbmdlcjA1IiwiZGVhZGxpbmUiOjE0NDcxMDI0Nzd9',
  init: {

  }
})