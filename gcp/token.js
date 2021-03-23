'use strict';
const tokenLib = require('../lib/token');
const Firestore = require('@google-cloud/firestore');
const PROJECTID = 'fhirfly';

const firestore = new Firestore({
	projectId: PROJECTID,
	timestampsInSnapshots: true,
  });
//Token proxy - GCP implementation.
//See the token library for full documentation.
exports.tokenHandler = async (req, res) => {
	var handlerResponse = await tokenLib.tokenHandler(req.body, req.headers)
	if(handlerResponse.refreshCacheObject) {
		await writeRefreshCache(handlerResponse.refreshCacheObject)
	}
	res.send( {
		statusCode: handlerResponse.statusCode,
		body: JSON.stringify(handlerResponse.body),
		headers: {"Cache-Control": "no-store", "Pragma": "no-cache"}
	})
}

async function writeRefreshCache(refreshObject) {
	console.log('Writing refresh object to database...')

	const data = {Item: {
		token_id: refreshObject.token_id,
		patient_id: refreshObject.patient_id,
		expires: (Math.floor(Date.now() / 1000) + (process.env.CACHE_TTL_MINS * 60))
	}};
    const ttl = process.env.CACHE_TTL_MINS;
    const ciphertext = (data.ciphertext || '').replace(/[^a-zA-Z0-9\-]*/g, '');
    const created = new Date().getTime();

	return firestore.collection(process.env.CACHE_TABLE_NAME)
      .add({ token, ttl, ciphertext })
      .then(doc => {
        return res.status(200).send(doc);
      }).catch(err => {
        console.error(err);
        return res.status(404).send({ error: 'unable to store', err });
      });
}
	
