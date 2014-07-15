var http = require('http'), fs = require('fs'), util = require('util'), mongoose = require('mongoose');

var frontSchema = mongoose.Schema({
  position: Number,
  type: String,
  fields: [
    {
      entry: String,
    }
  ]
});

var imageSchema = mongoose.Schema({
        ititle:  String,
        iimage: String
});

var productList = mongoose.Schema({
	products: [productSchema]
});

var productSchema = mongoose.Schema({
		ptitle: String,
		psdescription: String,
		pldescription: String,
		pprice: Number,
		pimage: String,
		ptags: String
	});

var settingsSchema = mongoose.Schema({
	page: {
		pageURL: String,
		pageTitle: String,
		pageCurrency: String,
		pageDisplayOnline: Boolean,
		pageHomepageListing: Boolean
	},
	style: {
		bgcolour: String,
		fontcolour: String,
		fontface: String,
		navbarcolor: String,
		navbarhighlight: String,
		navbartextcolor: String,
		footercolor: String,
		footertext: String
	},
	navbar: {
		navbarLogo: String
	},
	contact: {
		stAdd: String,
		city: String,
		province: String,
		country: String,
		phone:String,
		emailAdd: String
	},
	hours: {
		sunstart: String,
		sunend: String,
		monstart: String,
		monend: String,
		tuestart: String,
		tueend: String,
		wedstart: String,
		wedend: String,
		thustart: String,
		thuend: String,
		frstart: String,
		frend: String,
		satstart: String,
		satend: String
	}

});

var redirected_urls = {"/": "/index.html", "/about": "/aboutus.html", "/examples": "/examples.html", "/edit": "/settings.html", "/logout": "/logout.html"}
var unchanged_urls = ["/bootstrapvalidator-dist-0.4.5/dist/js/bootstrapValidator.js", "/index.css", "/index.js", "/settings.js",
                      "/settings.css", "/yuwei.JPG", "/keegan.jpg", "/jason.jpg", "/matt.jpg", "/exclamation.jpg"]
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

	//first check if email in use
	var users = mongoose.model('users', userSchema);
	users.findOne({user:email}, function (err,data) {
		if (err) {
			console.log(err);
			callback(true, "We're having some issues, try again later.");
			db.close()
			return;
		}
		if (data == null){
     	
			var newUser = new users({user:email, pass:password, url:url});
			newUser.save(function (err) {  
				if (err) {
				  console.log(err);
					callback(true, "We're having some issues, try again later.");
				  return;
				}

				users.findById(newUser._id, function(err, u) {
					if (err) {
						//User not created properly
						console.log(err);
						callback(true, "We're having some issues, try again later.");
						return;
					}
					console.log('Created user: ' + u.user);
				  callback(false, "");
				});
			});

			// Create dir on account creation
			fs.mkdir(('users/' + email),function(uerr){
				if(uerr){
					//users/email not created
					callback(true, "We're having some issues, try again later.");
					console.log(uerr);		
				} else {
          fs.mkdir(('users/' + email + '/images'),function(uerr){
				    if(uerr){
					    //users/email/images not created
					    callback(true, "We're having some issues, try again later.");
					    console.log(uerr);}
          });	
				}
			db.close();
		});}
		else {
			console.log(data);
			db.close()
			callback(true, "Email already in use");
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
		else if (data == null){
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
				console.log("received store settings edit request"); 
				res.writeHead(200);
				var pdata =JSON.parse(data);
				console.log('Updating ' + pdata.user + ' settings');
				mongoose.connect('mongodb://localhost:8081/easyStorefront');
				var db = mongoose.connection;
				db.on('error', console.error.bind(console, 'connection error:'));
				db.once('open', function callback () {
					console.log('Connected to MongoDB');
				});
				var settings = mongoose.model(((pdata.user).trim()) + 'settings', settingsSchema);
				var sdata = pdata.settings;
				var new_settings = new settings (
					{page: {
						pageURL: sdata.page.pageURL,
						pageTitle: sdata.page.pageTitle,
						pageCurrency: sdata.page.pageCurrency,
						pageDisplayOnline: sdata.page.pageDisplayOnline,
						pageHomepageListing: sdata.page.pageHomepageListing
					},
					style: {
						bgcolour: sdata.style.bgcolour,
						fontcolour: sdata.style.fontcolour,
						fontface: sdata.style.fontface,
						navbarcolor: sdata.style.navbarcolor,
						navbarhighlight: sdata.style.navbarhighlight,
						navbartextcolor: sdata.style.navbartextcolor,
						footercolor: sdata.style.footercolor,
						footertext: sdata.style.footertext
					},
					navbar: {
						navbarLogo: sdata.navbar.navbarLogo
					},
					contact: {
						stAdd: sdata.contact.stAdd,
						city: sdata.contact.city,
						province: sdata.contact.province,
						country: sdata.contact.province,
						phone: sdata.contact.phone,
						emailAdd: sdata.contact.emailAdd
					},
					hours: {
						sunstart: sdata.hours.sunstart,
						sunend: sdata.hours.sunend,
						monstart: sdata.hours.monstart,
						monend: sdata.hours.monend,
						tuestart: sdata.hours.tuestart,
						tueend: sdata.hours.tueend,
						wedstart: sdata.hours.wedstart,
						wedend: sdata.hours.wedend,
						thustart: sdata.hours.thustart,
						thuend: sdata.hours.thuend,
						frstart: sdata.hours.frstart,
						frend: sdata.hours.frend,
						satstart: sdata.hours.satstart,
						satend: sdata.hours.satend
					}

				});
				//clear the stored settings before saving new ones, kinda sketchy right now
				//will probably add a timestamp, 
				//then delete the entry with the oldest timestamp after new on is saved
				mongoose.connection.collections[(pdata.user) + 'settings'].drop( function(err) { 
					if (!err) {
						console.log(pdata.user + ' settings dropped'); 
					}
						 
					new_settings.save(function (err) {  
						if (err) {
							console.log(err);
							db.close();
							return;
						} else {
							console.log("settings saved sucessfully");
							db.close();
						}
					});
					
				});
				
				res.end("Your settings changes have been saved!");
			} else if (url == "/changeproducts") {
				console.log("received store products edit request"); 
				res.writeHead(200);
				var pdata =JSON.parse(data);
				console.log('Updating ' + pdata.user + ' products');
				mongoose.connect('mongodb://localhost:8081/easyStorefront');
				var db = mongoose.connection;
				db.on('error', console.error.bind(console, 'connection error:'));
				db.once('open', function callback () {
					console.log('Connected to MongoDB');
				});
				var pdata = JSON.parse(data);
				var products = mongoose.model(((pdata.user).trim()) + 'p', productSchema);
				var pList = mongoose.model(((pdata.user).trim()) + 'products', productList);
				var prodata = pdata.products;
				var new_products = new pList;
				for(var i = 0; i < prodata.length;i++){
					var new_product = new products({
						ptitle : prodata[i].ptitle,
						psdescription : prodata[i].psdescription,
						pldescription : prodata[i].pldescription,
						pprice : prodata[i].pprice,
						pimage : prodata[i].pimage,
						ptags : prodata[i].ptags
					});
					new_products.products.addToSet(new_product);
				}
				//clear the stored settings before saving new ones, kinda sketchy right now
				//will probably add a timestamp, 
				//then delete the entry with the oldest timestamp after new on is saved
				mongoose.connection.collections[(pdata.user) + 'products'].drop( function(err) { 
					if (!err) {
						console.log(pdata.user + ' products dropped'); 
					}
						 
					new_products.save(function (err) {  
						if (err) {
							console.log(err);
							db.close();
							return;
						} else {
							console.log("products saved sucessfully");
							db.close();
						}
					});
					
				});
				res.end("Your product changes have been saved!");
			} else if (url == "/changefrontpage") {
				console.log(data);
				res.writeHead(200);
				res.end("Not implemented!");
			} else if (url == "/changeproductpage") {
				console.log(data);
				res.writeHead(200);
				res.end("Not implemented!");
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
