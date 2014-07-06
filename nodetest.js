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


function registerUser(email, password, url) {
	fs.readFile("database.json", function (err,data) {
		if (err) {
			console.log("cannot open user database");
			return;
		}
		var data = JSON.parse(data);
		if (data.users[email]) {
			console.log("user with that name already registered!");
			return;
		}
		data.users[email] = {"password": password, "url": url};
		var data_str = JSON.stringify(data, null, "\t");
		fs.writeFile("database.json", data_str, function(err2) {
			if(err2) {
				console.log(err2);
			} else {
				console.log(util.format("user %s has been registered", email));
			}
		}); 
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
				registerUser(urlParams.signupEmail, urlParams.signupPass, urlParams.signupStoreName);
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
