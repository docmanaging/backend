const randomBytes = require('crypto').randomBytes;
const AWS = require('aws-sdk');

var dbUtils = require('./lib/dbUtils');

var requestParams;
var requestBody;

exports.handler =  (event, context, callback) => {  
    
	context.callbackWaitsForEmptyEventLoop = false;	

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
        dbUtils.validateCustUser(requestParams).then((response) => {       
        console.log("I am in GET");
        console.log("response is "+response);
    
        const response1= JSON.stringify(response);
				console.log("response is " + response1);
        const data = JSON.parse(response1);
        console.log("response 2 is "+data);

        const temp = data[0];

				const status_code = data.status;

				console.log ("status_code is " + status_code);
        console.log("here 2");
        
        const response2= JSON.stringify(response).replace(/]|[[]/g, '')
        callback(null, {
                statusCode: status_code,
                body: response2,
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