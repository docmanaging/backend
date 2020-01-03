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


async function getCountriesList(requestParams,context) {

	if (requestParams.userId){

	
		console.log("request params user Id"+requestParams.userId);
	
		var user_id = requestParams.userId;

		console.log("user Id is "+user_id);	
	
		const readTable = "select * from USERS where USER_ID='" + user_id + "'";
		console.log("query is "+readTable);
		const connQueryPromisified = util.promisify(connection.query).bind(connection);
		const results1 = await connQueryPromisified(readTable); 

		console.log("results 1 is "+results1.length);

		if (results1.length < 1) 
		{
			console.log ("invalid user");
			return {"status":401,"Message":"user is invalid"};
		} 
		else {
			
			
			var readTable2 = "select country_code,country_name,continent from COUNTRY_LIST_MASTER";
			
			console.log("query is "+readTable2);
			const connQueryPromisified = util.promisify(connection.query).bind(connection);
			const results2 = await connQueryPromisified(readTable2); 

			console.log("results 2 is "+results2);
			return {countriesList: results2};
		}

	}
	else {
		return {"status":422,"Message":"Required Params are missing"};
	}
}


module.exports = {	
	getCountriesList: getCountriesList 
}