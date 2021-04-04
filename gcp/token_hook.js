'use strict';
const tokenHookLib = require('../lib/token_hook')
const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'fhirfly';
const firestore = new Firestore({
	projectId: PROJECTID,
	timestampsInSnapshots: true,
  });
//Token hook - GCP interface.
//See the token hook library for full documentation.
exports.tokenHookHandler = async (req, res) => {
	try {
		var cachedPatientId = await get_refresh_cached_patient_id(JSON.parse(JSON.stringify(req.body)), res)
		var tokenHookResult = await tokenHookLib.tokenHookHandler(JSON.stringify(req.body), cachedPatientId)
		res.status(tokenHookResult.statusCode);
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
async function get_refresh_cached_patient_id(requestBodyObject, res) {
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
				console.log("No refresh token found")
				return null;
			}
			if (!(refreshTokenId && refreshTokenId.length)) {
				console.log("No refresh token found")
				return null;
			}
			return firestore.collection(process.env.CACHE_TABLE_NAME)
				.doc(refreshTokenId)
				.get()
				.then(doc => {
				if (!(doc && doc.exists)) {
					console.log("no refresh token found in cache")
					return null;
				}
				const data = doc.data();
				return data.Item.patient_id;
				}).catch(err => {
				console.error(err);
				return null;
				});
	}
	else {
		return null;
	}
	
}