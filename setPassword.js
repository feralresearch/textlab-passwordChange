const pg_host = process.env.SETPASSWORD_PG_HOST;
const pg_user = process.env.SETPASSWORD_PG_USER;
const pg_password = process.env.SETPASSWORD_PG_PASSWORD;
const pg_database = process.env.SETPASSWORD_PG_DATABASE;

const pg_url = "postgresql://"+pg_host+"/"+pg_database+"?user="+pg_user+"&password="+pg_password+"&ssl=false";
const argv = require('minimist')(process.argv.slice(2));
const bcrypt = require('bcrypt');
const pg = require('pg');

// Requires (--u or --e) and --p
if(( ( argv.u || argv.e || argv.i) && argv.p)){

	var newPassword = argv.p.toString().trim();
	if(newPassword.length < 0 || newPassword == 'true'){
		console.log("New password cannot be blank");
		process.exit()
	}

	bcrypt.hash(newPassword, 10, function(err, hash) {
		if(argv.u){
			var username = argv.u.toString().trim();
			if(username.length < 0 || username == 'true'){
				console.log("--u option requires that you specify a username");
				process.exit()
			}
			var sql = "UPDATE users SET encrypted_password = '"+hash+"' WHERE username = '" +this.username+ "'";
			console.log("Changing password for '"+username+"' to '"+newPassword+"'");

		}else if (argv.e){
			var email = argv.e.toString().trim();
			if(email.length < 0 || email == 'true'){
				console.log("--e option requires that you specify an email");
				process.exit()
			}
			var sql = "UPDATE users SET encrypted_password = '"+hash+"' WHERE email = '" +this.email+ "'";
			console.log("Changing password for '"+email+"' to '"+newPassword+"'");

		}else if (argv.i){
			var id = argv.i.toString().trim();
			if(id.length < 0 || id == 'true'){
				console.log("--i option requires that you specify a user id");
				process.exit()
			}
			var sql = "UPDATE users SET encrypted_password = '"+hash+"' WHERE id = '" +this.id+ "'";
			console.log("Changing password for user ID '"+id+"' to '"+newPassword+"'");
		}else{
			process.exit();
		}
		executeSQL(sql);

	}.bind( {
			} ));
}else{
	console.log('USAGE: setPassword [--u USERNAME | --e EMAIL | --i ID] --p NEWPASSWORD');
}

var executeSQL = function(sql) {
	var client = new pg.Client(pg_url);
	client.connect(function(err) {
	  if(err) {
	    return console.error('ERROR: could not connect to database', err);
	  }
	  client.query(sql, function(err, result) {
	    if(err) {
	      return console.error('ERROR: query failed!', err);
	    }
	    //console.log(result);
	    client.end();
	  });
	});
}
