var fs = require('fs'), util = require('util');
fs.readFile("database.json", function (err,data) {
	if (err) {
		console.log("cannot open user database");
		return;
	}
	var data = JSON.parse(data);
	for (user in data.users) {
		email = pw = data.users[user].email;
		pw = data.users[user].password;
		console.log(util.format("user %s has password %s", email, pw));
	}
});
