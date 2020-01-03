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
	
		const readTable = "select * from USERS where USER_ID='" + user_id + "' and cust_id='" + cust_id + "' and role='admin'";
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
	
		const readTable = "select * from USERS where USER_ID='" + user_id + "' and cust_id='" + cust_id + "' and role='admin'";
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
			
			const readTable = "select user_id,CONCAT(FIRST_NAME,' ',MIDDLE_NAME,' ',LAST_NAME) as full_name,user_name,role,active from USERS where CUST_ID='" + cust_id + "'";
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
	
		const readTable = "select * from USERS where USER_ID='" + user_id + "' and cust_id='" + cust_id + "' and active=TRUE";
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
			
			const readTable = "select user_id,user_name,CONCAT(FIRST_NAME,' ',MIDDLE_NAME,' ',LAST_NAME) as name, first_name,middle_name,last_name,role,mobile_num,desk_num from USERS where CUST_ID='" + cust_id + "' and USER_ID='" + user_id + "'";
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

async function addCustomerUser(requestParams,requestBody) {

	if (requestParams.customerId && requestParams.userId){

		console.log("request params customer ID"+requestParams.customerId);
		console.log("request params user id"+requestParams.userId);

		var cust_id = requestParams.customerId;
		var user_id = requestParams.userId;

		console.log("customer id is "+cust_id);
		console.log("user id is "+user_id);

		if (requestBody.userName && requestBody.firstName && requestBody.middleName && requestBody.lastName && requestBody.role && requestBody.mobileNum){	

			const readTable = "select * from USERS where USER_ID='" + user_id + "' and cust_id='" + cust_id + "' and role='admin'";
			console.log("query is "+readTable);
			const connQueryPromisified = util.promisify(connection.query).bind(connection);
			const results1 = await connQueryPromisified(readTable); 

			console.log("results 1 is "+results1.length);

			if (results1.length < 1) 
			{
				console.log ("invalid user");
				return {"status":401,"Message":"user is invalid or not permitted to add user"};
			} 
			else {

				var user_name= requestBody.userName;
				var first_name = requestBody.firstName;
				var middle_name = requestBody.middleName;
				var last_name = requestBody.lastName;
				var role = requestBody.role;
				var mobile_num = requestBody.mobileNum;

				console.log("user name is "+user_name);
				console.log("first name is "+first_name);
				console.log("middle name is "+middle_name);
				console.log("last name is "+last_name);
				console.log("role is "+role);
				console.log("mobile num is "+mobile_num);
		
				const readTable = "select * from USERS where USER_NAME='" + user_name + "'";
				console.log("query is "+readTable);
				const connQueryPromisified = util.promisify(connection.query).bind(connection);
				const results1 = await connQueryPromisified(readTable); 

				console.log("results 1 is "+results1.length);

				if (results1.length < 1) 
				{
					var writeTable = "INSERT INTO USERS(USER_NAME,CUST_ID,USER_TYPE,FIRST_NAME,MIDDLE_NAME,LAST_NAME,EMAIL_ID,ROLE,"
					writeTable += "PASSWORD,MOBILE_NUM,PRIMARY_CONTACT,ACTIVE,CREATED_BY,UPDATED_BY)"
					writeTable += "VALUES ('" + user_name + "','" + cust_id + "','custuser','" + first_name + "','" + middle_name + "','" + last_name + "',"
					writeTable += "'" + user_name + "','" + role + "','temp123456','" + mobile_num + "',FALSE,FALSE,'" + user_name + "','" + user_name + "')";

					console.log("insert query is "+writeTable);
					const connQueryPromisified = util.promisify(connection.query).bind(connection);
					const results = await connQueryPromisified(writeTable);   
					
					return {"status":201,"Message":"User added successfully"};
				}
				else {
					console.log ("invalid user");
					return {"status":400,"Message":"User already exists"};
				}
			}

		} else {
			return {"status":400,"Message":"Invalid Request"};
		}
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

			const readTable = "select * from USERS where USER_ID='" + user_id + "' and cust_id='" + cust_id + "' and role='admin'";
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
				var deleteTable1 = "DELETE FROM USERS WHERE USER_ID='" + requestBody.userId + "' and cust_id='" + cust_id + "'";
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

async function updateCustomerUserDetails(requestParams,requestBody) {
	if (requestParams.customerId && requestParams.userId){	

		console.log("request params customer ID"+requestParams.customerId);
		console.log("request params username"+requestParams.userId);
	
		var cust_id = requestParams.customerId;
		var user_id = requestParams.userId;

		console.log("customer id is "+cust_id);
		console.log("user name is "+user_id);		
			
		
		const readTable = "select * from USERS where USER_ID ='" + requestParams.userId + "' and CUST_ID='" + requestParams.customerId + "'";
		console.log("query is " + readTable);
		const connQueryPromisified1 = util.promisify(connection.query).bind(connection);
		const results1 = await connQueryPromisified1(readTable);

		console.log("results 1 is " + results1.length);

		if (results1.length < 1) {
			console.log("Invalid User details");
			return { "status": 401, "Message": "Invalid User details" };
		}
		else {

		

			var updateTable1 = "UPDATE USERS SET FIRST_NAME='" + requestBody.firstName + "',MIDDLE_NAME='" + requestBody.middleName + "',LAST_NAME='" + requestBody.lastName + "',MOBILE_NUM='" + requestBody.mobileNum + "',DESK_NUM='" + requestBody.workNum + "'"
				updateTable1 += ",UPDATED_BY='" + requestParams.userId + "'"
				updateTable1 += ",UPDATED_AT=CURRENT_TIMESTAMP WHERE USER_ID='" + requestParams.userId + "'";
				
			console.log("update query is "+updateTable1);
			const connQueryPromisified2 = util.promisify(connection.query).bind(connection);
			const results4 = await connQueryPromisified2(updateTable1);   
	
			console.log(JSON.stringify(results4));
			console.log("here 123");
			const response = JSON.stringify(results4);
			console.log("response is " + response );

			console.log("User Details Updated Successfully");
			return { "status": 201, "Message": "Usr Details Updated Successfully"};		
				
			
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
	addCustomerUser: addCustomerUser,
	updateCustomerUserDetails: updateCustomerUserDetails,
	deleteCustomerUser:deleteCustomerUser
  
}