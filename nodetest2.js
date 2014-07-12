var http = require('http'), fs = require('fs'), util = require('util'), mongoose = require('mongoose');;


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

 var userSchema = mongoose.Schema({user:String, pass:String, url: String});
function registerUser(email, password, url, callback) {
	return_value = undefined;
  mongoose.connect('mongodb://localhost:8081/easyStorefront');

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
    console.log('Connected to MongoDB');
  });


  var users = mongoose.model('users', userSchema);
  var newUser = new users({user:email, pass:password, url:url});
  newUser.save(function (err) {  
    if (err) {
      console.log(err);
      return;
    }

    users.findById(newUser._id, function(err, u) {
		  if (err) {
		    //User not created properly
		    console.log(err);
		    return;
		  }
		  console.log('Created user: ' + u.user);
  	});
	});

	// Create dir on account creation
	fs.mkdir(email,function(uerr){
	  if(uerr){
			//debug
	    console.log(uerr);
		
	  } else {
/*var imageSchema = mongoose.Schema({
        ititle:  String,
        iimage: String
}); 
var images = mongoose.model((email + "Images"), imageSchema);
	      var prods = mongoose.model((email + "Products"), productSchema);
       
        var settings = mongoose.model((email + "Settings"), settingsSchema);
        var front = mongoose.model((email + "Front"), FrontSchema);*/

	  }
	});
}


function login(email, password, callback) {
	mongoose.connect('mongodb://localhost:8081/easyStorefront');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
		console.log('Connected to MongoDB');
	});
	var users = mongoose.model('users', userSchema);
	users.findOne({user:email, pass:password}, function (err,data) {
		if (err) {
			console.log(err);
			db.close()
			return;
		}
		if (data == null){
     	db.close();
			callback(true, "Username or password incorrect");
			return;
		}
		else {
		console.log(data);
		db.close()
		callback(false, "");
}
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
			var urlParams = url_parse(data);

			if (url == "/register") {
				registerUser(urlParams.signupEmail, urlParams.signupPass, urlParams.signupStoreName, function (err, err_message) {
					if (err) {
						sendPageWithSubstitutions(res, "error.html", err_message);
					} else {
						sendPageWithSubstitutions(res, "registered.html", urlParams.signupEmail);
					}
				});

			} else if (url == "/login") {
				login(urlParams.email, urlParams.password, function (err, err_message) {
					if (err) {
						sendPageWithSubstitutions(res, "error.html", err_message);
					} else {
						sendPageWithSubstitutions(res, "login.html", urlParams.email);
					}
				});

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
			console.log("NOT YET IMPLEMENTED!! " + url)
			four_oh_four(res);
		} else {
			console.log("user tried to request disallowed file: " + url);
			four_oh_four(res);
		}
	}
}).listen(8080);

console.log("server running on port 8080");
