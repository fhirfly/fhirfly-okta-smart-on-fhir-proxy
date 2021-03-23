'use strict';
const keysLib = require('../lib/keys')

//Keys endpoint - GCP Lambda Implementation.
//See keys library for documentation.
exports.keysHandler = async (req, res) => {
	var keysResult = await keysLib.keysHandler()
	res.send( {
		statusCode: 200,
		body: JSON.stringify(keysResult)
	}
	)
}