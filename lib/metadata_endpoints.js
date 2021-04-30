'use strict';

//These endpoints are essentially static endpoints that advertise key information about the SMART authorization server.
//They are dyanamic endpoints in this reference implementation purely for ease of deployment.  
module.exports.smartConfigHandler = async (query) => {
	var api = '';
	if (query.api !== undefined){
		api = "/" + query.api;
	}
	
	return {
		"authorization_endpoint": process.env.GATEWAY_URL + api + '/authorize',
		"token_endpoint": process.env.GATEWAY_URL + api + '/token',
		"token_endpoint_auth_methods_supported": ["client_secret_basic"],
		"registration_endpoint": 'https://' + process.env.OKTA_ORG + '/oauth2/v1/clients',
		"scopes_supported": ["fhirUser","launch","launch/patient","patient/*.read","patient/AllergyIntolerance.read","patient/CarePlan.read","patient/CareTeam.read","patient/Condition.read","patient/Coverage.read","patient/Device.read","patient/DocumentReference.read","patient/Encounter.read","patient/ExplanationOfBenefit.read","patient/Goal.read","patient/Immunization.read","patient/Location.read","patient/Medication.read","patient/MedicationRequest.read","patient/Observation.read","patient/Organization.read","patient/Patient.read","patient/Practitioner.read","patient/PractitionerRole.read","patient/Procedure.read","patient/Provenance.read","openid","profile","email","address","phone","offline_access"],
		"response_types_supported": ["code", "code id_token", "id_token", "refresh_token"],
		"introspection_endpoint": process.env.AUTHZ_ISSUER + '/v1/introspect',
		"revocation_endpoint": process.env.AUTHZ_ISSUER + '/v1/revoke',
		"capabilities": ["launch-ehr", "client-public", "client-confidential-symmetric", "context-ehr-patient", "sso-openid-connect"]
	}
}