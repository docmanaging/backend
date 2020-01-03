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

async function validateUser(requestParams,context) {

	if (requestParams.userName && requestParams.password){	

		console.log("request params password "+requestParams.password);
		console.log("request params username "+requestParams.userName);
	
		
		var user_name = requestParams.userName;
		var password = requestParams.password;

		console.log("password is "+password);
		console.log("user name is "+user_name);	
	
		const readTable = "select user_id,user_name,role,user_type,cust_id,bank_id,first_name,middle_name,last_name from USERS where USER_NAME='" + user_name + "' and password='" + password + "' and ACTIVE=TRUE";
		console.log("query is "+readTable);
		const connQueryPromisified = util.promisify(connection.query).bind(connection);
		const results1 = await connQueryPromisified(readTable); 

		console.log("results 1 is "+results1.length);
	
		if (results1.length < 1) 
		{
			console.log ("invalid user");
			return {"status":401,"message":"Provided details are Invalid"};
			
		} 
		else {
			console.log ("valid user");
			//return {"status":200,"role":result1};		
			//return results1;
			return results1;
		}
	}
	else {
       return {"status":422,"message":"Required Params are missing"};
    }  
}


module.exports = {
  validateUser: validateUser  
}