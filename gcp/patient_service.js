'use strict';
const PatientLib = require('../lib/patient_service')

// patient access service. AWS Lambda implementation.
// For more detail see the patient library.
exports.PatientServiceHandler = async (req, res) => {
	var PatientResult = await PatientLib.PatientServiceHandler()
	res.status(200);
	res.send(PatientResult);
}