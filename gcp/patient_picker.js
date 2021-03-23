'use strict';
const patientPickerLib = require('../lib/patient_picker')

patientPickerGetHandler = async (req, res) => {
	var getResult = await patientPickerLib.getHandler(req.headers[Object.keys(req.headers).find(key => key.toLowerCase() === 'cookie')])
	res.send( {
		statusCode: getResult.statusCode,
		body: getResult.body,
		headers: {
			'content-type': 'text/html'
		}
	})
}

patientPickerPostHandler = async (req, res) => {
	var postResult = await patientPickerLib.postHandler(req.body, req.headers[Object.keys(req.headers).find(key => key.toLowerCase() === 'cookie')])
	res.send( {
		statusCode: postResult.statusCode,
		body: JSON.stringify(postResult.body),
		headers: {
			Location: postResult.location
		},
		multiValueHeaders: {
			'Set-Cookie': [
				'appProxyAuthzState=' + postResult.appProxyAuthzStateCookie + '; Secure; HttpOnly',
				'apiAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT',
				'pickerAuthzState=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
			]
		}
	})
}


