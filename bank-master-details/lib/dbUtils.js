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


async function getBankMasterDetails(requestParams,context) {

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
			
			if (requestParams.bankName || requestParams.bankID ) {
				var readTable2 = "select bank_id,bank_cust_id,bank_name,primary_contact_name,primary_email,primary_contact_num from BANK_MASTER";
				if (requestParams.bankName){
					var bank_name=requestParams.bankName;
					readTable2 += " where bank_name like '%"+ bank_name +"%'";
					if(requestParams.bankID)
					{
						var bank_id=requestParams.bankID;
						readTable2 += " or bank_id ='"+ bank_id +"'";
					}
				}
				else {
					var bank_id=requestParams.bankID;
					readTable2 += " where bank_id ='"+ bank_id +"'";
				}
			}
			else {
				console.log ("Required Params are missing");
				return {"status":422,"Message":"Required Params are missing"};
			}

			console.log("query is "+readTable2);
			const connQueryPromisified = util.promisify(connection.query).bind(connection);
			const results2 = await connQueryPromisified(readTable2); 

			console.log("results 2 is "+results2);
			return {bankmasterdetails: results2};
		}

	}
	else {
		return {"status":422,"Message":"Required Params are missing"};
	}
}

async function registerBankMasterDetails(requestParams,requestBody) {

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
	
			
			var writeTable1 = "INSERT INTO BANK_MASTER(BANK_CUST_ID,BANK_NAME,PRIMARY_CONTACT_NAME,PRIMARY_EMAIL,PRIMARY_CONTACT_NUM,CHECKER_VERIFIED,ACTIVE,"
					writeTable1 += "CREATED_BY,UPDATED_BY)"
					writeTable1 += "VALUES ('" + requestBody.bankCustomerId + "','" + requestBody.bankName + "','" + requestBody.primaryContactName + "','" + requestBody.primaryContactEmailId + "','" + requestBody.primaryContactPhoneNo + "',FALSE,TRUE,"
					writeTable1 += "'" + requestParams.userId + "','" + requestParams.userId + "')";

					console.log("insert query is "+writeTable1);
					const connQueryPromisified2 = util.promisify(connection.query).bind(connection);
					const results2 = await connQueryPromisified2(writeTable1);  
					
					console.log(JSON.stringify(results2));
					console.log("here 123");
					const response = JSON.stringify(results2);
					console.log("response is " + response );
					const data = JSON.parse(response);
					const bank_id = data.insertId;

					//return results;
					console.log("here 1");
					console.log ("bank_id is " + bank_id);
					
				
				return {"status":201,"bank_id":bank_id};
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
	getBankMasterDetails: getBankMasterDetails,	
	registerBankMasterDetails: registerBankMasterDetails  
}