'use strict';
const tokenHookLib = require('../lib/token_hook')
const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'fhirfly';

//Token hook - GCP interface.
//See the token hook library for full documentation.
exports.tokenHookHandler = async (req, res) => {
	try {
		var cachedPatientId = await get_refresh_cached_patient_id(req.body)
		var tokenHookResult = await tokenHookLib.tokenHookHandler(req.body, cachedPatientId)
		res.status = tokenHookResult.statusCode;
		res.setHeader('Content-Type', 'application/json');
		res.send(tokenHookResult.body);
	}
	catch(error) {
		//When a token hook fails, we still want to res.send( a 200 to Okta, with an error message.
		//In this way, Okta will reject all tokens in the req that our token hook fails.
		//Most errors are caught at the expected source, but this is a catch-all.
		console.log(error)
		res.status(200);
		res.setHeader('Content-Type', 'application/json');
		res.send({"error": {errorSummary: "An unexpected error has occurred in the token hook. See the cloud logs for more detail."}});
	}
}

//This method, if we're in the middle of an access token refresh, will get the cached patient_id, if applicable.
async function get_refresh_cached_patient_id(requestBodyObject) {
	if(requestBodyObject.source.endsWith('/token')) {
		var refreshTokenId = requestBodyObject.data.context.protocol.originalGrant.refresh_token.jti;
		console.log('Getting refresh object from database...')
		console.log('Refresh token id:' + refreshTokenId)
		var params = {
			TableName: process.env.CACHE_TABLE_NAME,
			Key: {
				token_id: refreshTokenId
			}
		};

		// read/retrieve an existing document by id
			if (!(refreshTokenId)) {
				res.send( null );
			}
			if (!(refreshTokenId && refreshTokenId.length)) {
				res.send( null );
			}
			return firestore.collection(process.env.CACHE_TABLE_NAME)
				.doc(refreshTokenId)
				.get()
				.then(doc => {
				if (!(doc && doc.exists)) {
					res.send( null );
				}
				const data = doc.data();
				return res.send(data.Item.patient_id);
				}).catch(err => {
				console.error(err);
				res.send( null );
				});
	}
	else {
		res.send( null )
	}
	
}