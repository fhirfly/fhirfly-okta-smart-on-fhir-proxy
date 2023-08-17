'use strict';
//const pem2jwk = require('pem-jwk').pem2jwk
//const fs = require('fs');
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

//This is just a helper function to get the JWKS public key that will need to be specified on all public (not trusted) apps.
//Keys Endpoint - This is the public keys endpoint that will publish our public signing key.
module.exports.keysHandler = async () => {
	//var signingKeyPublic = fs.readFileSync('public_key.pem')
	//var jwkPublic = pem2jwk(signingKeyPublic)
	
	//var signingKeyPublic = fs.readFileSync('public_key.jwks')
    var PubSign = myCache.get( "PubSign" );

    if ( PubSign  == undefined ){
        console.log("Loading PubSign from Secrets......");  
		try{
			var signingKeyPublic = await AccessSecret("projects/577362005659/secrets/SMART_PUBLIC/versions/latest", function (err) {
			console.log('Read signingKeyPublic from storage...');
			});;
			var jwkPublic = JSON.parse(signingKeyPublic)
			myCache.set("PubSign", jwkPublic .toString());
			console.log("PubSign cached ......");
			
			return { keys: [jwkPublic] }
		}
		catch (err) {
			console.log(err);
			return err;
		}
	}
	else{
        console.log("Loaded CACert from cache...")
        return { keys: [PubSign] }
    } 

}

async function AccessSecret(secretid) {
    // Create the secret with automation replication.
	const client = new SecretManagerServiceClient();
    try{
        console.log("Reading secret: " + secretid + " from store.." )
        const [accessResponse] = await client.accessSecretVersion({
            name: secretid,
          });         
        const responsePayload = accessResponse.payload.data.toString('utf8');
        return responsePayload;              
    }
    // Access the secret.
    catch(err){
        console.log("Error reading secret " + secretid + " from store: " + err)
        return err;
    }    
}