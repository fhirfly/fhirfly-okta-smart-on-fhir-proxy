'use strict';
const authorizeLib = require('../lib/authorize');

//Authorize endpoint - GCP implementation.
//See the authorize library for full details.
exports.authorizeHandler = async (req, res) => {
	console.log(req.query);
	var authorizeResult = await authorizeLib.authorizeHandler(req.query)
	res.status(authorizeResult.statusCode);
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Location', authorizeResult.location);
	res.setHeader('Set-Cookie', [
		'pickerAuthzState=' + authorizeResult.pickerAuthzCookie + '; Secure; HttpOnly',
		'origRequest=' + authorizeResult.origRequestCookie + '; Secure; HttpOnly'
	])
	res.send(authorizeResult.body);
}

//Patient picker/custom consent screen OIDC callback endpoint - GCP implementation.
//See the authorize library for full details.
//This endpoint should be moved over to the patient picker module.
exports.pickerCallbackHandler = async (req, res) => {
	var pickerCallbackResult = await authorizeLib.pickerCallbackHandler(req.query, req.headers[Object.keys(req.headers).find(key => key.toLowerCase() === 'cookie')])
	res.status(pickerCallbackResult.statusCode);
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Location', pickerCallbackResult.location);
	res.setHeader('Set-Cookie',  [
		'apiAccessToken=' + pickerCallbackResult.apiAccessTokenCookie + '; Secure; HttpOnly',
	])
	res.send(pickerCallbackResult.body);
}

//Authorize OAuth2 callback proxy endpoint - GCP implementation.
//See the authorize library for full details.
exports.authorizeCallbackHandler = async (req, res) => {
	var authorizeCallbackResult = await authorizeLib.authorizeCallbackHandler(req.query, req.headers[Object.keys(req.headers).find(key => key.toLowerCase() === 'cookie')])
	res.status(authorizeCallbackResult.statusCode);
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Location', authorizeCallbackResult.location);
	res.setHeader('Set-Cookie',  [
		'origRequest=; expires=Thu, 01 Jan 1970 00:00:00 GMT',
		'appProxyAuthzState=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
	])
	res.send(authorizeCallbackResult.body);
}