'use strict';

// patient access service.
// Just returns a list of sample patients for display in the custom consent patient picker.
// In a real implementation, this service would make an API call to an internal fine grained authorization service.
module.exports.PatientServiceHandler = async () => {

	const {google} = require('googleapis');
	const healthcare = google.healthcare('v1');
	
	const listConsents = async () => {
	  const auth = await google.auth.getClient({
		scopes: ['https://www.googleapis.com/auth/cloud-platform'],
	  });
	  google.options({auth});
	  //us-east4/datasets/synthea/consentStores/fhirfly-consent
	  // TODO(developer): uncomment these lines before running the sample
	  const cloudRegion = 'us-east4';
	  const projectId = 'fhirfly';
	  const datasetId = 'synthea';
	  const consentStoreId = 'fhirfly-consent';

	  // const resourceId = '9a664e07-79a4-4c2e-04ed-e996c75484e1;
	  const name = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/consentStores/${consentStoreId}`;
	  const request = {name};
	
	  // Regardless of whether the operation succeeds or
	  // fails, the server returns a 200 OK HTTP status code. To check that the
	  // resource was successfully deleted, search for or get the resource and
	  // see if it exists.
	  await healthcare. projects.locations.datasets.consentStores.list(
		request
	  );
	  console.log('ListConsents');
	};
	
	//listConsents();

	return [
		{patient_id: '05c5fb73-44ec-eab9-7c32-b4b61fdbad63', patient_name: 'Abe604 VonRueden37'},
		//{patient_id: 'Patient/57ca5687-e198-4b36-9a44-e9460debc611', patient_name: 'Sherlock Holmes (31) (reference)'},
		//{patient_id: 'https://yourFHIRserver.com/Patient/81f65d61-8f91-4472-b668-0efc0aceb0f2', patient_name: 'Mycroft Holmes (38) (full url)'},
		//{patient_id: 'Patient/7f344d58-113d-45aa-88cf-c74d8e925d1d', patient_name: 'John Watson (34) (reference)'},
		//{patient_id: 'https://fake.ehr.com/Patient/external', patient_name: '	Sir Arthur Conan Doyle (68) (external patient)'},
	]
}