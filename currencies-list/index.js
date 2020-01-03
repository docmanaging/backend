const randomBytes = require('crypto').randomBytes;
const AWS = require('aws-sdk');

var dbUtils = require('./lib/dbUtils');

var requestParams;
var requestBody;

exports.handler =  (event, context, callback) => {  
    
    context.callbackWaitsForEmptyEventLoop = false;	
    

    var resource1 = JSON.stringify(event.resource);
    console.log('Received resource:', resource1);

    var resource = JSON.parse(resource1);
    
    
    console.log ("method is : " + event["httpMethod"]);
    
   
	if (event["httpMethod"] == "GET") {
		var requestParams = event.queryStringParameters;
		console.log('customer request Params'+requestParams);
		
		if(requestParams == null || requestParams == ''){
			console.error("Request Params are empty!!");
			errorResponse("Empty Request", context.awsRequestId, callback);
		}
	}
    
	if (event["httpMethod"] == "POST") {
		var requestParams = event.queryStringParameters;
		console.log('customer request Params'+requestParams);

		   var requestBody = JSON.parse(event.body);
            console.log('customer requestBody'+requestBody);
           console.log('customer requestBody 123'+JSON.stringify(requestBody));
			
			if(requestBody == null || requestBody == ''){
				console.error("Request body is empty!!");
				errorResponse("Empty Request", context.awsRequestId, callback);
			}
		if(requestParams == null || requestParams == ''){
			console.error("Request Params are empty!!");
			errorResponse("Empty Request", context.awsRequestId, callback);
		}
    } 
  
    if (event["httpMethod"] == "GET") {
        dbUtils.getCurrenciesList(requestParams).then((response) => {       
        console.log("I am in GET customer users summary");
        console.log("response is "+response);
        console.log("I am in GET customer user details");
		console.log("response is "+response);
        const response1= JSON.stringify(response);
        console.log("response is " + response1);
        const data = JSON.parse(response1);
        console.log("response 2 is "+data);

        const temp = data[0];

                const status_code = data.status;

                console.log ("status_code is " + status_code);
        console.log("here 2");
        callback(null, {
                statusCode: status_code,
                body: JSON.stringify(
                       response
                ),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }).catch((err) => {
            console.error(err);
            errorResponse(err.message, context.awsRequestId, callback)
        });   
    }
    

    if (event["httpMethod"] == "POST") {
        dbUtils.registerBankMasterDetails(requestParams,requestBody).then((response) => {
        //registerCustomer(requestBody.userId,requestBody.username).then((response) => {
        console.log("I am in POST");        
		console.log("response is "+response);
        const response1= JSON.stringify(response);
        console.log("response is " + response1);
        const data = JSON.parse(response1);
        console.log("response 2 is "+data);

        const temp = data[0];

                const status_code = data.status;

                console.log ("status_code is " + status_code);
        console.log("here 2");
        callback(null, {
                statusCode: status_code,
                body: JSON.stringify(
                       response
                ),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }).catch((err) => {
            console.error(err);
            errorResponse(err.message, context.awsRequestId, callback)
        });   
    } 
    
  
};

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}