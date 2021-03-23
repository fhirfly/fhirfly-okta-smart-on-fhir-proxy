'use strict';
const authorizeLib = require('../lib/authorize')

//Authorize endpoint - GCP implementation.
//See the authorize library for full details.
authorizeHandler = async (req, res) => {
	var authorizeResult = await authorizeLib.authorizeHandler(req.queryStringParameters)
	res.send( {
		statusCode: authorizeResult.statusCode,
		body: JSON.stringify(authorizeResult.body),
		headers: {
			Location: authorizeResult.location
		},
		multiValueHeaders: {
			'Set-Cookie': [
				'pickerAuthzState=' + authorizeResult.pickerAuthzCookie + '; Secure; HttpOnly',
				'origRequest=' + authorizeResult.origRequestCookie + '; Secure; HttpOnly'
			]
		}
	}
	)
}

//Patient picker/custom consent screen OIDC callback endpoint - GCP implementation.
//See the authorize library for full details.
//This endpoint should be moved over to the patient picker module.
pickerCallbackHandler = async (req, res) => {
	var pickerCallbackResult = await authorizeLib.pickerCallbackHandler(req.queryStringParameters, req.headers[Object.keys(req.headers).find(key => key.toLowerCase() === 'cookie')])
	res.send( {
		statusCode: pickerCallbackResult.statusCode,
		body: JSON.stringify(pickerCallbackResult.body),
		headers: {
			Location: pickerCallbackResult.location
		},
		multiValueHeaders: {
			'Set-Cookie': [
				'apiAccessToken=' + pickerCallbackResult.apiAccessTokenCookie + '; Secure; HttpOnly',
			]
		}
	}
	)
}

//Authorize OAuth2 callback proxy endpoint - GCP implementation.
//See the authorize library for full details.
exports.authorizeCallbackHandler = async (req, res) => {
	var authorizeCallbackResult = await authorizeLib.authorizeCallbackHandler(req.queryStringParameters, req.headers[Object.keys(req.headers).find(key => key.toLowerCase() === 'cookie')])
	res.send( {
		statusCode: authorizeCallbackResult.statusCode,
		body: JSON.stringify(authorizeCallbackResult.body),
		headers: {
			Location: authorizeCallbackResult.location
		},
		multiValueHeaders: {
			'Set-Cookie': [
				'origRequest=; expires=Thu, 01 Jan 1970 00:00:00 GMT',
				'appProxyAuthzState=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
			]
		}
	}
	)
}