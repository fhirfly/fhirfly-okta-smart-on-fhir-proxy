'use strict';
const patientPickerLib = require('../lib/patient_picker')

exports.patientPickerGetHandler = async (req, res) => {
	var getResult = await patientPickerLib.getHandler(req.headers[Object.keys(req.headers).find(key => key.toLowerCase() === 'cookie')])
	res.status = getResult.statusCode;
	res.setHeader('Content-Type', 'text/html');
	res.send(getResult.body);
}

exports.patientPickerPostHandler = async (req, res) => {
	var postResult = await patientPickerLib.postHandler(req.body, req.headers[Object.keys(req.headers).find(key => key.toLowerCase() === 'cookie')])
	res.status = postResult.statusCode;
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Location', postResult.location);
	res.setHeader('Set-Cookie', [
		'appProxyAuthzState=' + postResult.appProxyAuthzStateCookie + '; Secure; HttpOnly',
		'apiAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT',
		'pickerAuthzState=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
	])
	res.send(postResult.body);
}


