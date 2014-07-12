var http = require('http'), fs = require('fs'), util = require('util');


var redirected_urls = {"/": "/index.html", "/about": "/aboutus.html", "/examples": "/examples.html", "/edit": "/settings.html", "/logout": "/logout.html"}
var unchanged_urls = ["/bootstrapvalidator-dist-0.4.5/dist/js/bootstrapValidator.js", "/index.css", "/index.js", "/settings.js", "/settings.css",
                      "/yuwei.JPG", "/keegan.jpg", "/jason.jpg", "/matt.jpg"]
/* Included for security purposes, as well as to create a RESTful API.
   Static urls only - dynamic stuff like /login is handled separately. */



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
		fs.mkdir(email,function(uerr){
		  if(err){
				//debug
		     console.log(uerr);
			
		  } else {
		    fs.writeFile(("./" + email + "/images.json"), "", function(ierr) {
					if(ierr) {
						console.log(ierr);
					} else {
						console.log(util.format("/%s/images.json file was saved!", email));
					}
				}); 
				fs.writeFile(("./" + email + "/products.json"), "", function(perr) {
					if(perr) {
						console.log(perr);
					} else {
						console.log(util.format("/%s/products.json file was saved!", email));
					}
				}); 
				fs.writeFile(("./" + email + "/front.json"), "", function(ierr) {
					if(ierr) {
						console.log(ierr);
					} else {
						console.log(util.format("/%s/front.json file was saved!", email));
					}
				}); 

				fs.mkdir(("./" + email + "/images"), function(iderr){
					if (iderr){
						console.log(iderr);
					}else {
						console.log(util.format("/%s/images directory was saved!", email));
					}
				});
		  }
		});
	});
}


function login(email, password, callback) {
	fs.readFile("database.json", function (err,data) {
		if (err) {
			console.log(err);
			return;
		}
		data = JSON.parse(data);
		if (!data.users[email]) {
			callback(true, "No user with that email exists!");
			return;
		}
		if (data.users[email].password != password) {
			callback(true, "Wrong password!");
			return;
		}
		callback(false, "");
	});
}



function four_oh_four(res) {
	res.writeHead(404);
	fs.readFile(__dirname + "/404.html", function (err,data) {
		if (err) {
			res.end("404 error - 404 page not found");
		} else {
			res.end(data);
		}
	});
}


function sendPageWithSubstitutions(res, url, message) {
	fs.readFile(__dirname + "/" + url, function (err,data) {
		if (err) {;
			four_oh_four(res);
		} else {
			res.writeHead(200);
			res.end(data.toString().replace("%s", message));
		}
	});
}


http.createServer(function (req, res) {
	var url = req.url
	if (req.method == "POST") {
		var data = "";

		req.on('data', function(data_piece) {
			data += data_piece;
		});

		req.on('end', function() {

			if (url == "/register") {
				var urlParams = url_parse(data);
				registerUser(urlParams.signupEmail, urlParams.signupPass, urlParams.signupStoreName, function (err, err_message) {
					if (err) {
						sendPageWithSubstitutions(res, "error.html", err_message);
					} else {
						sendPageWithSubstitutions(res, "registered.html", urlParams.signupEmail);
					}
				});

			} else if (url == "/login") {
				var urlParams = url_parse(data);
				login(urlParams.email, urlParams.password, function (err, err_message) {
					if (err) {
						sendPageWithSubstitutions(res, "error.html", err_message);
					} else {
						sendPageWithSubstitutions(res, "login.html", urlParams.email);
					}
				});

			} else if (url == "/changesettings") {
				console.log("received store edit request. this hasn't been implemented yet."); //"data" currently contains the json for the store settings
				res.writeHead(200);
				res.end("Your changes have been saved!\n...actually, we haven't implemented that.");

			} else {
				console.log("unknown POST request. url params:");
				console.log(urlParams);
				four_oh_four(res);
			}

		});

	} else if (req.method == "GET") {
		if (redirected_urls[url] != undefined) {
			fs.readFile(__dirname + redirected_urls[url], function (err,data) {
				if (err) {
					console.log(redirected_urls[url] + " should have been found, but wasn't!");
					four_oh_four(res);
				} else {
					res.writeHead(200);
					res.end(data);
				}
			});
		} else if (unchanged_urls.indexOf(url) >= 0) {
			fs.readFile(__dirname + url, function (err,data) {
				if (err) {
					console.log(url + " should have been found, but wasn't!");
					four_oh_four(res);
				} else {
					res.writeHead(200);
					res.end(data);
				}
			});
		} else if (url.substring(0,6) == "/store") {
			if (url.slice(-1) == "/") {
				url = url.slice(0, -1);
			}

			thirdslash = url.indexOf("/", 7);
			if (thirdslash == -1) {
				store_url = url.substring(7);
				page_url = "";
			} else {
				store_url = url.substring(7, thirdslash);
				page_url = url.substring(thirdslash + 1);
			}

			if (store_url == "") {
				four_oh_four(res);
				return;
			}

			console.log(util.format("user tried to request page '%s' from store '%s'. but we haven't implemented this yet!!", page_url, store_url));
			four_oh_four(res);
		} else {
			console.log("user tried to request disallowed file: " + url);
			four_oh_four(res);
		}
	}
}).listen(8080);

console.log("server running on port 8080");
