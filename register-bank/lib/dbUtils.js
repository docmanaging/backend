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

async function getCustomerUsersSummary(requestParams,context) {

	if (requestParams.customerId && requestParams.userId){	

		console.log("request params customer ID"+requestParams.customerId);
		console.log("request params userid"+requestParams.userId);
	
		var cust_id = requestParams.customerId;
		var user_id = requestParams.userId;

		console.log("customer id is "+cust_id);
		console.log("user id is "+user_id);	
	
		const readTable = "select * from CUSTOMER_USERS where ID='" + user_id + "' and cust_id='" + cust_id + "' and role='admin'";
		console.log("query is "+readTable);
		const connQueryPromisified = util.promisify(connection.query).bind(connection);
		const results1 = await connQueryPromisified(readTable); 

		console.log("results 1 is "+results1.length);
	
		if (results1.length < 1) 
		{
			console.log ("invalid user");
			return {"status":401,"Message":"user is invalid or unauthorized"};
		} 
		else {		
			
			const readTable = "select role,count(*) as count from CUSTOMER_USERS where CUST_ID='" + cust_id + "' group by role";
			console.log("query is "+readTable);
			const connQueryPromisified = util.promisify(connection.query).bind(connection);
			const results = await connQueryPromisified(readTable);			
			return results;
		}
	}
	else {
       return {"status":422,"Message":"Required Params are missing"};
    }  
}

async function getCustomerUsersDetails(requestParams,context) {

	if (requestParams.customerId && requestParams.userId){	

		console.log("request params customer ID"+requestParams.customerId);
		console.log("request params user Id"+requestParams.userId);
	
		var cust_id = requestParams.customerId;
		var user_id = requestParams.userId;

		console.log("customer id is "+cust_id);
		console.log("user Id is "+user_id);	
	
		const readTable = "select * from CUSTOMER_USERS where ID='" + user_id + "' and cust_id='" + cust_id + "' and role='admin'";
		console.log("query is "+readTable);
		const connQueryPromisified = util.promisify(connection.query).bind(connection);
		const results1 = await connQueryPromisified(readTable); 

		console.log("results 1 is "+results1.length);
	
		if (results1.length < 1) 
		{
			console.log ("invalid user");
			return {"status":401,"Message":"user is invalid or unauthorized"};
		} 
		else {
			
			const readTable = "select id as user_id,CONCAT(FIRST_NAME,' ',MIDDLE_NAME,' ',LAST_NAME) as full_name,user_id as user_name,role,active from CUSTOMER_USERS where CUST_ID='" + cust_id + "'";
			console.log("query is "+readTable);
			const connQueryPromisified = util.promisify(connection.query).bind(connection);
			const results = await connQueryPromisified(readTable);			
			return {users: results};
		}
	}
	else {
       return {"status":422,"Message":"Required Params are missing"};
    }  
}

async function getCustomerUserDetails(requestParams,context) {

	if (requestParams.customerId && requestParams.userId){	

		console.log("request params customer ID"+requestParams.customerId);
		console.log("request params username"+requestParams.userId);
	
		var cust_id = requestParams.customerId;
		var user_id = requestParams.userId;

		console.log("customer id is "+cust_id);
		console.log("user id is "+user_id);	
	
		const readTable = "select * from CUSTOMER_USERS where ID='" + user_id + "' and cust_id='" + cust_id + "' and active=TRUE";
		console.log("query is "+readTable);
		const connQueryPromisified = util.promisify(connection.query).bind(connection);
		const results1 = await connQueryPromisified(readTable); 

		console.log("results 1 is "+results1.length);
	
		if (results1.length < 1) 
		{
			console.log ("invalid user");
			return {"status":401,"Message":"user is invalid or unauthorized"};
		} 
		else {
			
			const readTable = "select id as user_id,user_id as user_name,CONCAT(FIRST_NAME,' ',MIDDLE_NAME,' ',LAST_NAME) as name, first_name,middle_name,last_name,role,mobile_num,desk_num from CUSTOMER_USERS where CUST_ID='" + cust_id + "' and ID='" + user_id + "'";
			console.log("query is "+readTable);
			const connQueryPromisified = util.promisify(connection.query).bind(connection);
			const results = await connQueryPromisified(readTable);			
			return results;
		}
	}
	else {
       return {"status":422,"Message":"Required Params are missing"};
    }  
}

async function registerBank(requestParams,requestBody) {

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
					writeTable1 += "VALUES ('" + requestBody.bankDetails.bankCustomerId + "','" + requestBody.bankDetails.bankName + "','" + requestBody.bankDetails.primaryContactName + "','" + requestBody.bankDetails.primaryContactEmailId + "','" + requestBody.bankDetails.primaryContactPhoneNo + "',FALSE,TRUE,"
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
					console.log("here 2");

					var writeTable2 = "INSERT INTO BANK_PREFERENCES(BANK_ID,SERVICE_SUBSCRIBED,SERV_START_DATE,SERV_END_DATE,BANK_USER_SUPPORT,CLIENT_USER_SUPPORT,PAYMENT_AUTH,"
					writeTable2 += "NO_PAYMENT_AUTH,CREATED_BY,UPDATED_BY)"
					writeTable2 += "VALUES ('" + bank_id + "','" + requestBody.bankDetails.bankServiceSubscription + "','" + requestBody.bankDetails.servciceActivationStartDate + "','" + requestBody.bankDetails.serviceActivationEndDate + "','" + requestBody.bankDetails.supportReqforBankUserMgmt + "',"
					writeTable2 += "'" + requestBody.bankDetails.supportReqforClientUserMgmt + "','" + requestBody.bankDetails.authManualPymtActivity + "','" + requestBody.bankDetails.authNonPymtActivity + "','" + user_id + "','" + user_id + "')";

					console.log("insert query is "+writeTable2);
					const connQueryPromisified3 = util.promisify(connection.query).bind(connection);
					const results3 = await connQueryPromisified3(writeTable2);   
 
					var writeTable3 = "INSERT INTO BANK_ADDRESS(BANK_ID,TRADING_ADD_LINE1,TRADING_ADD_LINE2,TRADING_ADD_CITY,TRADING_ADD_STATE,TRADING_ADD_COUNTRY,TRADING_ADD_POST_CODE,"
					writeTable3 += "REGISTER_ADD_LINE1,REGISTER_ADD_LINE2,REGISTER_ADD_CITY,REGISTER_ADD_STATE,REGISTER_ADD_COUNTRY,REGISTER_ADD_POST_CODE,CREATED_BY,UPDATED_BY)"
					writeTable3 += "VALUES ('" + bank_id + "','" + requestBody.bankDetails.addressLine1 + "','" + requestBody.bankDetails.addressLine2 + "','" + requestBody.bankDetails.cityName + "','" + requestBody.bankDetails.state + "','" + requestBody.bankDetails.country + "','" + requestBody.bankDetails.postCode + "',"
					writeTable3 += "'" + requestBody.bankDetails.regAddressLine1 + "','" + requestBody.bankDetails.regAddressLine2 + "','" + requestBody.bankDetails.regCity + "','" + requestBody.bankDetails.regState + "','" + requestBody.bankDetails.regCountry + "','" + requestBody.bankDetails.regPostCode + "','" + user_id + "','" + user_id + "')";

					console.log("insert query is "+writeTable3);
					const connQueryPromisified4 = util.promisify(connection.query).bind(connection);
					const results4 = await connQueryPromisified3(writeTable3);   
 
				
				return {"status":201,"Message":"Bank setup is completed successfully"};
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

async function deleteCustomerUser(requestParams,requestBody) {

	if (requestParams.customerId && requestParams.userId){

		console.log("request params customer ID"+requestParams.customerId);
		console.log("request params userId"+requestParams.userId);

		var cust_id = requestParams.customerId;
		var user_id= requestParams.userId;

		console.log("customer id is "+cust_id);
		console.log("user Id is "+user_id);

		console.log ("request body is "+requestBody);


		if (requestBody.userId){	

			const readTable = "select * from CUSTOMER_USERS where ID='" + user_id + "' and cust_id='" + cust_id + "' and role='admin'";
			console.log("query is "+readTable);
			const connQueryPromisified = util.promisify(connection.query).bind(connection);
			const results1 = await connQueryPromisified(readTable); 

			console.log("results 1 is "+results1.length);

			if (results1.length < 1) 
			{
				console.log ("invalid user");
				return {"status":401,"Message":"user is invalid or not permitted to delete user"};
			} 
			else {
				var deleteTable1 = "DELETE FROM CUSTOMER_USERS WHERE ID='" + requestBody.userId + "' and cust_id='" + cust_id + "'";
				console.log("delete query is "+deleteTable1);
				const connQueryPromisified2 = util.promisify(connection.query).bind(connection);
				const results2 = await connQueryPromisified2(deleteTable1);   
		
				console.log(JSON.stringify(results2));
				console.log("here 123");
				const response = JSON.stringify(results2);
				console.log("response is " + response );

				return {"status":200,"Message":"User deleted successfully"};
			}
		}
		else {
			return {"status":400,"Message":"Invalid Request"};
		}		
	}
	else {
		return {"status":422,"Message":"Required Params are missing"};
	}
}

module.exports = {
	getCustomerUsersSummary: getCustomerUsersSummary,
	getCustomerUsersDetails: getCustomerUsersDetails,
	getCustomerUserDetails: getCustomerUserDetails,
	registerBank: registerBank,
	deleteCustomerUser:deleteCustomerUser
  
}