'use strict';
const metadataLib = require('../lib/metadata_endpoints');

//Metadata endpoints - GCP Lambda Interface
//See the metadata library for more detail.
exports.smartConfigHandler = async (req, res) => {
	var smartConfigResult = await metadataLib.smartConfigHandler()
	res.send( smartConfigResult);
}

exports.metadataHandler = async (req, res) => {
	var metadataResult = await metadataLib.metadataHandler()
	res.send( metadataResult);
}