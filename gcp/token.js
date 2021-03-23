'use strict';
const tokenLib = require('../lib/token')
const GCP = require('GCP-sdk');
GCP.config.update({
	region: process.env.GCP_REGION
})
const dynamoDB = new GCP.DocumentClient()

//Token proxy - GCP implementation.
//See the token library for full documentation.
tokenHandler = async (req, res) => {
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
	var result = await dynamoDB.put({
		TableName: process.env.CACHE_TABLE_NAME,
		Item: {
			token_id: refreshObject.token_id,
			patient_id: refreshObject.patient_id,
			expires: (Math.floor(Date.now() / 1000) + (process.env.CACHE_TTL_MINS * 60))
		}
	}).promise()
	console.log(result)
	res.send( result )
}