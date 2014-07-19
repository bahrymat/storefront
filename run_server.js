var http = require('http'), fs = require('fs'), util = require('util'), mongoose = require('mongoose'), multiparty = require('multiparty'),
    querystring = require('querystring');

var eleSchema = mongoose.Schema({
  position: Number,
  type: String,
  fields: { type : Array , "default" : [] }
});

var eleList = mongoose.Schema({
  elements: [eleSchema]
});

var imageSchema = mongoose.Schema({
        ititle:  String,
        iimage: { type: [String], unique: true }
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
	try {
		var match,
			pl     = /\+/g,  // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); }

		var urlParams = {};
		while (match = search.exec(query))
		   urlParams[decode(match[1])] = decode(match[2]);
		return urlParams;
	} catch (URIError) {
		return "";
	}
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
			console.log("Problem A");
			callback(true, "We're having some issues, try again later.");
			db.close();
			return;
		}
		if (data == null) {
     	
			var newUser = new users({user:email, pass:password, url:url});
			newUser.save(function (err) {
				if (err) {
					console.log(err);
					console.log("Problem B");
					callback(true, "We're having some issues, try again later.");
					db.close();
					return;
				}

				users.findById(newUser._id, function (err, u) {
					if (err) {
						//User not created properly
						console.log(err);
						console.log("Problem C");
						db.close();
						callback(true, "We're having some issues, try again later.");
						return;
					}
					// Create dir on account creation
					fs.mkdir(('users/' + email),function (uerr) {
						if (uerr) {
							//users/email not created
							console.log("Problem D");
							callback(true, "We're having some issues, try again later.");
							console.log(uerr);		
							db.close();
						} else {
							fs.mkdir(('users/' + email + '/images'), function (uerr) {
								if (uerr) {
									//users/email/images not created
									console.log("Problem E");
									callback(true, "We're having some issues, try again later.");
									console.log(uerr);
								} else {
									console.log('Created user: ' + u.user);
									db.close();
									callback(false, "");
								}
							});	
						}
					});
					
				});
			});
		} else {
			console.log(data);
			callback(true, "Email already in use");
			db.close();
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
			callback(true, "Theres problems");
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

function upload_image(req, res, img_directory) {
	var form = new multiparty.Form();

	form.parse(req, function(err, fields, files) {
		if (err) {
			console.log(err);
			four_oh_four(res); //a bit lazy
			return;
		}

		var pretty_name = fields.imname[0];
		var user_email = fields.email[0];
		var filename = files.imfile[0].originalFilename;
		
		var db_name = user_email.replace(".", "_").replace("@", "__") + "images";
						
		mongoose.connect('mongodb://localhost:8081/easyStorefront');
		var db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function callback () {
			console.log('Connected to MongoDB');
			var Image = mongoose.model(db_name, imageSchema);
			var new_image = new Image({ititle: pretty_name, iimage: filename})
			new_image.save(function(err, data) {
				if (err) {
					console.log(err);
					db.close();
					if (err.err.indexOf("duplicate key") != -1) {
						sendPageWithSubstitutions(res, "error.html", "You may not use the same filename twice.");
					} else {
						four_oh_four(res);
					}
					return;
				}
				fs.readFile(files.imfile[0].path, function (err, data) {
					if (err) {
						console.log(err);
						four_oh_four(res);
						return;
					}
					
					var newPath = __dirname + "/users/" + user_email + "/images/" + filename;
					
					fs.writeFile(newPath, data, function (err) {
						if (err) {
							console.log(err);
							four_oh_four(res);
							return;
						}
						console.dir(new_image);
						res.writeHead(303, {'Location': '/edit#images'});
						res.end();
						db.close();
					});
					
				});
				
			});
			
		});

	});

	return;
}


http.createServer(function (req, res) {
	var url = req.url;
	
	if (req.method == "POST") {
	
		if (url == "/addimage") { // special case - we need to use the request object to save the image.
			upload_image(req, res);
			return;
		}
	
	
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
				settings.findOne({}, function (err,q) {
					var old = null;
					if (err) {
						console.log(err + ' here');
						db.close()
						return;
					}
					else if (q != null){
					 	old = q._id;
					}
					new_settings.save(function (err) {  
						if (err) {
							console.log(err + ' or here');
							db.close();
							return;
						} else {
							if (old != null){
								settings.remove({_id: old}, function(err) {
									if (err) {
										console.log(err + ' maybe here');//this gets thrown for some reason
										return;
									}
								});}
							console.log("Products saved sucessfully");
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
				pList.findOne({}, function (err,q) {
					var old = null;
					if (err) {
						console.log(err + ' here');
						db.close()
						return;
					}
					else if (q != null){
					 	old = q._id;
					}
					new_products.save(function (err) {  
						if (err) {
							console.log(err + ' or here');
							db.close();
							return;
						} else {
							if (old != null){
								pList.remove({_id: old}, function(err) {
									if (err) {
										console.log(err + ' maybe here');//this gets thrown for some reason
										return;
									}
								});}
							console.log("Products saved sucessfully");
							db.close();
						}
					});
				});
				
				res.end("Your product changes have been saved!");
			} else if (url == "/changefrontpage") {
				console.log("received store front edit request"); 
				res.writeHead(200);
				var pdata = JSON.parse(data);
				console.log('Updating ' + pdata.user + ' frontpage');
				mongoose.connect('mongodb://localhost:8081/easyStorefront');
				var db = mongoose.connection;
				db.on('error', console.error.bind(console, 'connection error:'));
				db.once('open', function callback () {
					console.log('Connected to MongoDB');
				});
				var edata = JSON.parse(data);
				var elements = mongoose.model('elements', eleSchema);
				var eList = mongoose.model(((pdata.user).trim()) + 'frontpage', eleList);
				var eledata = pdata.frontPageElements;
				var new_elements = new eList;
				for(var i = 0; i < eledata.length;i++){
					var new_ele = new elements({
						type : eledata[i].type,
						pos : eledata[i].pos
					});
					if (new_ele.type == 'ImageBlock'){
					new_ele.fields = [
					  {ititle: eledata[i].ititle}, 
					  {idescription: eledata[i].idescription},
					  {iimage:eledata[i].iimage}];
					} else if (new_ele.type == 'TextBlock'){
					new_ele.fields = [
					  {ttitle: eledata[i].ttitle}, 
					  {tdescription: eledata[i].tdescription}];
					} else if (new_ele.type == 'Carousel'){
					new_ele.fields = [
					  {cimage1: eledata[i].cimage1},
					  {cimage2: eledata[i].cimage2},
					  {cimage3: eledata[i].cimage3}];
					} else if (new_ele.type == 'StartShoppingButton'){
					//incase we change contents
					new_ele.fields = [];
					} else {
					//This should never be reached
					console.log('something bad happened saving the front page');
					}
					new_elements.elements.addToSet(new_ele);
				}
				eList.findOne({}, function (err,q) {
					var old = null;
					if (err) {
						console.log(err + ' here');
						db.close()
						return;
					}
					else if (q != null){
					 	old = q._id;
					}
					new_elements.save(function (err) {  
						if (err) {
							console.log(err + ' or here');
							db.close();
							return;
						} else {
							if (old != null){
								eList.remove({_id: old}, function(err) {
									if (err) {
										console.log(err + ' maybe here');//this gets thrown for some reason
										return;
									}
								});}
							console.log("frontpage saved sucessfully");
							db.close();
						}
					});
					
				});

				res.end("Your Home Page changes have been saved!");

			} else if (url == "/changeproductpage") {
				console.log("received store front edit request"); 
				res.writeHead(200);
				var pdata = JSON.parse(data);
				console.log('Updating ' + pdata.user + ' product page');
				mongoose.connect('mongodb://localhost:8081/easyStorefront');
				var db = mongoose.connection;
				db.on('error', console.error.bind(console, 'connection error:'));
				db.once('open', function callback () {
					console.log('Connected to MongoDB');
				});
				var edata = JSON.parse(data);
				var elements = mongoose.model('elements', eleSchema);
				var eList = mongoose.model(((pdata.user).trim()) + 'productpage', eleList);
				var eledata = pdata.productsPageElements;
				var new_elements = new eList;
				for(var i = 0; i < eledata.length;i++){
					var new_ele = new elements({
						type : eledata[i].type,
						pos : eledata[i].pos
					});
					if (new_ele.type == 'ImageBlock'){
					new_ele.fields = [
					  {ititle: eledata[i].ititle}, 
					  {idescription: eledata[i].idescription},
					  {iimage:eledata[i].iimage}];
					} else if (new_ele.type == 'TextBlock'){
					new_ele.fields = [
					  {ttitle: eledata[i].ttitle}, 
					  {tdescription: eledata[i].tdescription}];
					} else if (new_ele.type == 'Carousel'){
					new_ele.fields = [
					  {cimage1: eledata[i].cimage1},
					  {cimage2: eledata[i].cimage2},
					  {cimage3: eledata[i].cimage3}];
					} else if (new_ele.type == 'StartShoppingButton'){
					//incase we change contents
					new_ele.fields = [];
					} else {
					//This should never be reached
					console.log('something bad happened saving the front page');
					}
					new_elements.elements.addToSet(new_ele);
				}
				eList.findOne({}, function (err,q) {
					var old = null;
					if (err) {
						console.log(err + ' here');
						db.close()
						return;
					}
					else if (q != null){
					 	old = q._id;
					}
					new_elements.save(function (err) {  
						if (err) {
							console.log(err + ' or here');
							db.close();
							return;
						} else {
							if (old != null){
								eList.remove({_id: old}, function(err) {
									if (err) {
										console.log(err + ' maybe here'); //this gets thrown for some reason
										return;
									}
								});}
							console.log("Product page saved sucessfully");
							db.close();
						}
					});
				});

				res.end("Your Product Page changes have been saved!");

			} else if (url.substring(0,12) == "/deleteimage") {
			
				var path = url.split("/");
				if (path.length != 4) {
					return;
				}
				var user = path[2];
				var filename = querystring.unescape(path[3]);
				console.log(user);
				console.log(filename);
			
				fs.unlink(__dirname + "/users/" + user + "/images/" + filename, function (err) {
					if (err) {
						console.log(err);
					}
					
					var db_name = user.replace(".", "_").replace("@", "__") + "images";
					
					mongoose.connect('mongodb://localhost:8081/easyStorefront');
					var db = mongoose.connection;
					db.on('error', console.error.bind(console, 'connection error:'));
					db.once('open', function callback () {
						console.log('Connected to MongoDB');
						var Image = mongoose.model(db_name, imageSchema);
						Image.findOne({iimage: filename}).remove(function(err) {
							if (err) {
								console.log(err);
								four_oh_four(res);
								db.close();
								return;
							}
							console.log(user + "'s " + filename + " deleted");
							res.writeHead(200);
							res.end();
							db.close();
						});
					});
					
				});
				
			} else {
				var urlParams = url_parse(data);
				console.log("unknown POST request. url/params:");
				console.log(url);
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
		} else if (url.substring(0,13) == "/getstoredata") {
			res.writeHead(200, {"Content-Type": "application/json"});
			var store_data = {images:[]}
			var user = url.substring(14);
			var subbed_user = user.replace(".", "_").replace("@", "__");
			if (user == "") {
				four_oh_four(res);
				return;
			}
			mongoose.connect('mongodb://localhost:8081/easyStorefront');
			var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function () {
				var Images = mongoose.model(subbed_user + "images", imageSchema);
				console.log('Connected to MongoDB');
				Images.find(function (err, image_data) {
					if (err) {
						console.error(err);
						db.close();
						return;
					}
					db.close();
					store_data.images = image_data;
					res.end(JSON.stringify(store_data));
				});
			});
		} else {
			console.log("user tried to request disallowed file: " + url);
			four_oh_four(res);
		}
	}
}).listen(8080);

console.log("server running on port 8080");
