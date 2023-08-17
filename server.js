const smart = require('./gcp/index');

const express = require('express');
const app = express();

// METADATA ENDPOINTS
app.get('/.well-known/smart-configuration', smart.smartConfigHandler);
app.get('/keys', smart.keysHandler);

// AUTHORIZE ENDPOINTS
app.get('/authorize', smart.authorizeHandler);
app.get('/picker_oidc_callback', smart.pickerCallbackHandler);
app.get('/smart_proxy_callback', smart.authorizeCallbackHandler);

// TOKEN ENDPOINT
app.get('/token', smart.tokenHandler);

// PATIENT PICKER UI
app.get('/patient_authorization', smart.patientPickerGetHandler);
app.post('/patient_authorization', smart.patientPickerPostHandler);

// TOKEN HOOK
app.get('/tokenhook', smart.tokenHookHandler);

// PATIENT POLICY API
app.get('/patientService', smart.PatientServiceHandler);

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});