const pg_host = 'localhost';
const pg_user = '';
const pg_password = '';
const pg_database = 'tl';

const pg_url = "postgresql://"+pg_host+"/"+pg_database+"?user="+pg_user+"&password="+pg_password+"&ssl=false";
const argv = require('minimist')(process.argv.slice(2));
const bcrypt = require('bcrypt');
const pg = require('pg');

// Requires (--u or --e) and --p
if(( (argv.u || argv.e || argv.i) && argv.p)){
	var username = argv.u;
	var email = argv.e;
	var id = argv.i;
	var newPassword = argv.p.toString();
	bcrypt.hash(newPassword, 10, function(err, hash) {
		if(username){
			var sql = "UPDATE users SET encrypted_password = '"+hash+"' WHERE username = '" +this.username+ "'";
			console.log("Changing password for "+username+" to: "+newPassword);
		}else if (email){
			var sql = "UPDATE users SET encrypted_password = '"+hash+"' WHERE email = '" +this.email+ "'";
			console.log("Changing password for "+username+" to: "+newPassword);
		}else {
			var sql = "UPDATE users SET encrypted_password = '"+hash+"' WHERE id = '" +this.id+ "'";
			console.log("Changing password for user ID "+id+" to: "+newPassword);
		}
		executeSQL(sql);

	}.bind( {'username': username,
			 'email': email,
			 'id':id
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
