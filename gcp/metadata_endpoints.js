'use strict';
const metadataLib = require('../lib/metadata_endpoints');

exports.smartConfigHandler = async (req, res) => {
	var smartConfigResult = await metadataLib.smartConfigHandler(req.query)
	res.send( smartConfigResult);
}
