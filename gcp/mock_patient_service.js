'use strict';
const mockPatientLib = require('../lib/mock_patient_service')

// Mock patient access service. AWS Lambda implementation.
// For more detail see the mock patient library.
exports.mockPatientServiceHandler = async (req, res) => {
	var mockPatientResult = await mockPatientLib.mockPatientServiceHandler()
	res.status(200);
	res.send(mockPatientResult);
}