const mysql = require('mysql');
const util = require('util');
//create connection to mysql DB
const connection = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  database : process.env.RDS_DATABASE
});

//connect to mysql DB
connection.connect();


async function getBankAddressDetails(requestParams,context) {

	if (requestParams.userId){	

	
		console.log("request params user Id"+requestParams.userId);
	
		var user_id = requestParams.userId;

		console.log("user Id is "+user_id);	
	
		const readTable = "select * from USERS where USER_ID='" + user_id + "' and user_type='wmuser' and role='admin'";
		console.log("query is "+readTable);
		const connQueryPromisified = util.promisify(connection.query).bind(connection);
		const results1 = await connQueryPromisified(readTable); 

		console.log("results 1 is "+results1.length);

		if (results1.length < 1) 
		{
			console.log ("invalid user");
			return {"status":401,"Message":"user is invalid or not permitted to setup Bank"};
		} 
		else {
			
			if (requestParams.bankID ) {
				var bank_id = requestParams.bankID;
				var readTable2 = "select bank_id,TRADING_ADD_LINE1,TRADING_ADD_LINE2,TRADING_ADD_CITY,TRADING_ADD_STATE,TRADING_ADD_COUNTRY,TRADING_ADD_POST_CODE,REGISTER_ADD_LINE1,REGISTER_ADD_LINE2,REGISTER_ADD_CITY,REGISTER_ADD_STATE,REGISTER_ADD_COUNTRY,REGISTER_ADD_POST_CODE from BANK_ADDRESS where bank_id='"+ bank_id +"'";
				
			}
			else {
				console.log ("Required Params are missing");
				return {"status":422,"Message":"Required Params are missing"};
			}

			console.log("query is "+readTable2);
			const connQueryPromisified = util.promisify(connection.query).bind(connection);
			const results2 = await connQueryPromisified(readTable2); 

			console.log("results 2 is "+results2);
			return {bankaddressdetails: results2};
		}

	}
	else {
		return {"status":422,"Message":"Required Params are missing"};
	}
}

async function UploadBankAddressDetails(requestParams,requestBody) {

	if (requestParams.userId){

		
		console.log("request params user id"+requestParams.userId);
	
		var user_id = requestParams.userId;		
		console.log("user id is "+user_id);



	
		const readTable = "select * from USERS where USER_ID='" + user_id + "' and user_type='wmuser' and role='admin'";
		console.log("query is "+readTable);
		const connQueryPromisified = util.promisify(connection.query).bind(connection);
		const results1 = await connQueryPromisified(readTable); 

		console.log("results 1 is "+results1.length);

		if (results1.length < 1) 
		{
			console.log ("invalid user");
			return {"status":401,"Message":"user is invalid or not permitted to setup Bank"};
		} 
		else {
			
			const readTable2 = "select * from BANK_ADDRESS where BANK_ID='" + requestParams.bankID + "'";
			console.log("query is " + readTable);
			const connQueryPromisified1 = util.promisify(connection.query).bind(connection);
			const results2 = await connQueryPromisified1(readTable2);

			console.log("results 2 is " + results2.length);

			if (results2.length >= 1) {
				console.log("Updating bank address details");

				var updateTable1 = "UPDATE BANK_ADDRESS SET TRADING_ADD_LINE1='" + requestBody.addressLine1 + "',TRADING_ADD_LINE2='" + requestBody.addressLine2 + "',TRADING_ADD_CITY='" + requestBody.cityName + "',TRADING_ADD_STATE='" + requestBody.state + "',TRADING_ADD_COUNTRY='" + requestBody.country + "',TRADING_ADD_POST_CODE='" + requestBody.postCode + "',"
					updateTable1 += "REGISTER_ADD_LINE1='" + requestBody.regAddressLine1 + "',REGISTER_ADD_LINE2='" + requestBody.regAddressLine2 + "',REGISTER_ADD_CITY='" + requestBody.regCity + "',REGISTER_ADD_STATE='" + requestBody.regState + "',REGISTER_ADD_COUNTRY='" + requestBody.regCountry + "',REGISTER_ADD_POST_CODE='" + requestBody.regPostCode + "',UPDATED_BY='" + requestParams.userId + "'"
					updateTable1 += ",UPDATED_AT=CURRENT_TIMESTAMP WHERE BANK_ID='" + requestParams.bankID + "'";
					
				console.log("update query is "+updateTable1);
				const connQueryPromisified2 = util.promisify(connection.query).bind(connection);
				const results4 = await connQueryPromisified2(updateTable1);   
		
				console.log(JSON.stringify(results4));
				console.log("here 123");
				const response = JSON.stringify(results4);
				console.log("response is " + response );

				console.log("Address Details Updated Successfully");
				return { "status": 201, "Message": "Address Details Updated Successfully"};		
				
			}
			else {
			
				var writeTable3 = "INSERT INTO BANK_ADDRESS(BANK_ID,TRADING_ADD_LINE1,TRADING_ADD_LINE2,TRADING_ADD_CITY,TRADING_ADD_STATE,TRADING_ADD_COUNTRY,TRADING_ADD_POST_CODE,"
				writeTable3 += "REGISTER_ADD_LINE1,REGISTER_ADD_LINE2,REGISTER_ADD_CITY,REGISTER_ADD_STATE,REGISTER_ADD_COUNTRY,REGISTER_ADD_POST_CODE,CREATED_BY,UPDATED_BY)"
				writeTable3 += "VALUES ('" + requestParams.bankID + "','" + requestBody.addressLine1 + "','" + requestBody.addressLine2 + "','" + requestBody.cityName + "','" + requestBody.state + "','" + requestBody.country + "','" + requestBody.postCode + "',"
				writeTable3 += "'" + requestBody.regAddressLine1 + "','" + requestBody.regAddressLine2 + "','" + requestBody.regCity + "','" + requestBody.regState + "','" + requestBody.regCountry + "','" + requestBody.regPostCode + "','" + user_id + "','" + user_id + "')";

				console.log("insert query is "+writeTable3);
				const connQueryPromisified2 = util.promisify(connection.query).bind(connection);
				const results2 = await connQueryPromisified2(writeTable3);   
					
					return {"status":201,"Message":"Bank address details are uploaded successfully"};
			}
		}
		//	else {
		//		console.log ("invalid user");
		//		return {"status":400,"Message":"User already exists"};
		//	}
	//	}

	//
	}
	else {
		return {"status":422,"Message":"Required Params are missing"};
	}
}

module.exports = {	
	getBankAddressDetails: getBankAddressDetails,	
	UploadBankAddressDetails: UploadBankAddressDetails  
}