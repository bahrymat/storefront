var http = require('http'), fs = require('fs'), util = require('util');;



/* converts url string in the form "email=foo@bar.com&password=abc123" into an object
   http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript */
function url_parse(query) {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); }

    var urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
	return urlParams;
}


function registerUser(email, password, url, callback) {
	return_value = undefined;
	fs.readFile("database.json", function (err,data) {
		if (err) {
			console.log("cannot open user database");
			callback(true, "We're having some issues, try again later.");
			return;
		}
		var data = JSON.parse(data);
		if (data.users[email]) {
			console.log("user with that email already registered!");
			callback(true, "Sorry, that email is already in use.");
			return;
		}
		data.users[email] = {"password": password, "url": url};

		var data_str = JSON.stringify(data, null, "\t");
		fs.writeFile("database.json", data_str, function(err2) {
			if(err2) {
				console.log(err2);
				callback(true, "We're having some issues, try again later.");
			} else {
				console.log(util.format("user %s has been registered", email));
				callback(false, "");
			}
		});
		// Create dir/.json files on account creation
		//used http://stackoverflow.com/questions/13696148/node-js-create-folder-or-use-existing for dir creation
		fs.mkdir(email,function(err){
		  if(err){
				//debug
		     console.log(e);
			
		  } else {
		      //http://stackoverflow.com/questions/2496710/writing-files-in-nodejs fro file creation
				fs.writeFile(("./" + email + "/images.json"), "", function(err) {
					if(err) {
						console.log(err);
					} else {
						console.log(util.format("/%s/images.json file was saved!", email));
					}
				}); 
				fs.writeFile(("./" + email + "/products.json"), "", function(err) {
					if(err) {
						console.log(err);
					} else {
						console.log(util.format("/%s/products.json file was saved!", email));
					}
				}); 
				fs.writeFile(("./" + email + "/front.json"), "", function(err) {
					if(err) {
						console.log(err);
					} else {
						console.log(util.format("/%s/front.json file was saved!", email));
					}
				}); 

				fs.mkdir(("./" + email + "/images"), function(err){
					if (err){
						console.log(err);
					}else {
						console.log(util.format("/%s/images directory was saved!", email));
					}
				});
		  }
		});
//end_cite
	});
}




http.createServer(function (req, res) {
	var url = req.url
	if (url.slice(-1) == "/") {
		url = url + "index.html";
	}
	if (req.method == "POST") {
		var data = "";

		req.on('data', function(data_piece) {
			data += data_piece;
		});

		req.on('end', function() {
			var urlParams = url_parse(data);

			if (url == "/register") {
				reg = registerUser(urlParams.signupEmail, urlParams.signupPass, urlParams.signupStoreName, function (err, err_message) {
					if (err) {
						res.writeHead(200);
						res.end(err_message);
					} else {
						res.writeHead(200);
						res.end("You have registered!");
					}
				});
			}

		});

	} else {
		fs.readFile(__dirname + url, function (err,data) {
			if (err) {
				res.writeHead(404);
				fs.readFile(__dirname + "/404.html", function (err,data) {
					if (err) {
						res.end("404 error - 404 page not found");
					} else {
						res.end(data);
					}
				});
			} else {
				res.writeHead(200);
				res.end(data);
			}
		});
	}
}).listen(8080);

console.log("server running on port 8080");
