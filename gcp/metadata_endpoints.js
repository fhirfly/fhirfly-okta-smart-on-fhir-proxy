'use strict';
const metadataLib = require('../lib/metadata_endpoints')

//Metadata endpoints - GCP Lambda Interface
//See the metadata library for more detail.
smartConfigHandler = async (req, res) => {
	var smartConfigResult = await metadataLib.smartConfigHandler()
	res.send( {
		statusCode: 200,
		body: JSON.stringify(smartConfigResult)
	}
	)
}

metadataHandler = async (req, res) => {
	var metadataResult = await metadataLib.metadataHandler()
	res.send( {
		statusCode: 200,
		body: JSON.stringify(metadataResult)
	}
	)
}