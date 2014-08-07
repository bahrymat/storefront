var http = require('http'), fs = require('fs'), util = require('util'), mongoose = require('mongoose'), multiparty = require('multiparty'),
    querystring = require('querystring'), crypto = require('crypto'), validator = require('validator');





var db = mongoose.connection;
mongoose.connect('mongodb://localhost:8081/easyStorefront', {server:{auto_reconnect:true}});

db.on('error', console.error.bind(console, 'connection error:'));
db.on('reconnect', function callback(){
	console.log('Reconnected to MongoDB');
});
db.once('open', function callback () {
  console.log("Connected to MongoDB");
});




var userSchema = mongoose.Schema({
	user:String, 
	pass:String, 
	salt: String,
	url: String, 
	examplesListing: Boolean,
	csrfToken: String,
	sessionToken: String
});
	
var eleSchema = mongoose.Schema({
  pos: Number,
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
	},
	hasBeenGenerated: Boolean

});

var redirected_urls = {"/": "/index.html", "/about": "/aboutus.html", "/edit": "/settings.html", "/logout": "/logout.html"}
var unchanged_urls = ["/bootstrapvalidator-dist-0.4.5/dist/js/bootstrapValidator.js", "/index.css", "/index.js", "/settings.js",
                      "/settings.css", "/yuwei.JPG", "/keegan.jpg", "/jason.jpg", "/matt.jpg", "/exclamation.jpg", "/store_generic.css"]
/* Included for security purposes, as well as to create a RESTful API.
   Static urls only - dynamic stuff like /login is handled separately. */
   
   
function hash_email(email) {
	//converts an email to a md5 hash, so that it only has alphanumeric characters.
	return crypto.createHash('md5').update(email).digest('hex');
}

function sanitize(string) {
	return validator.stripLow(string, true).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function unsanitize(string) {
	return string.replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&");
}



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

var iterationlen = 10000;
var bsize = 256;

function registerUser(email, password, url, callback) {
	return_value = undefined;
	
	var valid_chars = /^[a-zA-Z0-9_-]*$/;
	var valid_email_chars = /^[a-zA-Z0-9_.+@-]*$/;
	
	if (email.length < 1 || password.length < 1 || url.length < 1) {
		callback(true, "All fields must be filled in.");
		return;
	} else if (email.length > 100 || password.length > 100 || url.length > 100) {
		callback(true, "There is a limit of 100 characters.");
		return;
	} else if (!email.match(valid_email_chars)) {
		callback(true, "Emails can only use the letters A-Z, the numbers 0-9, and the following symbols: _ - . + @");
		return;
	} else if (!url.match(valid_chars) || !password.match(valid_chars)) {
		callback(true, "URLs and passwords can only use the letters A-Z, the numbers 0-9, and the symbols _ and -.");
		return;
	}
	
	//first check if email in use
	var users = mongoose.model('users', userSchema);
	users.findOne({user:email}, function (err,data) {
		if (err) {
			console.log(err);
			console.log("Problem A");
			callback(true, "We're having some issues, try again later.");
			
			return;
		}
		if (data == null) {
			crypto.randomBytes(bsize, function(err, salt) {
  				if (err) {
  					console.log(err);
					console.log("Salt generation error");
					callback(true, "We're having some issues, try again later.");
					return;
				}
				salt = salt.toString('hex');
				console.log(password);
				crypto.pbkdf2(password, salt, iterationlen, bsize, function(err, hash) {
					if (err) {
  						console.log(err);
						console.log("Password generation error");
						callback(true, "We're having some issues, try again later.");
						return;
					}
					hash = hash.toString('hex');
					//console.log(hash);
					var newUser = new users({user:email, pass:hash, salt:salt, url:url, examplesListing:false});

					newUser.save(function (err) {
						if (err) {
							console.log(err);
							console.log("Problem B");
							callback(true, "We're having some issues, try again later.");
							return;
						}

						users.findById(newUser._id, function (err, u) {
							if (err) {
								//User not created properly
								console.log(err);
								console.log("Problem C");
								callback(true, "We're having some issues, try again later.");
								return;
							}
							// Create dir on account creation
							fs.mkdir(('users/' + hash_email(email)),function (uerr) {
								if (uerr) {
									//users/email not created
									console.log("Problem D");
									callback(true, "We're having some issues, try again later.");
									console.log(uerr);
									return;
								} else {
									fs.mkdir(('users/' + hash_email(email) + '/images'), function (uerr) {
										if (uerr) {
											//users/email/images not created
											console.log("Problem E");
											callback(true, "We're having some issues, try again later.");
											console.log(uerr);
											return;
										} else {
											console.log('Created user: ' + u.user);
											callback(false, "");
											return;
										}
									});	
								}
							});
						});
					});
				});
			});
		} else {
			console.log(data);
			callback(true, "Email already in use");
			return;
		}
	});
}


function login(email, password, callback) {
	var users = mongoose.model('users', userSchema);
	users.findOne({user:email}, function (err,data) {
		if (err) {
			console.log(err);
			callback(true, "There's problems");
			return;
		}
		else if (data == null){
			callback(true, "User no found");
			return;
		}
		else if (data.salt) { 
			//generate hash from salt
			crypto.pbkdf2(password, data.salt, iterationlen, bsize, function(err, hash) {
				if (err) {
  					console.log(err);
					console.log("Password hashing error");
					callback(true, "We're having some issues, try again later.");
					return;
				}
				hash = hash.toString('hex');
				if (hash == data.pass){
					console.log(data.user + ' logged in');
					callback(false, "");
					return;
				} else {
					callback(true, "Incorrect password");
					return;
				}
			});
		} else {
			//only way data.salt could be missing is if the database is in the old format
			callback(true, "Your user account is in the assignment2 format, try registering a new one.");
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
			four_oh_four(res); 
			return;
		}

		var pretty_name = fields.imname[0];
		var user_email = fields.email[0];
		var filename = files.imfile[0].originalFilename;
		
		var db_name = hash_email(user_email) + "images";
						
		var Image = mongoose.model(db_name, imageSchema);
		var new_image = new Image({ititle: pretty_name, iimage: filename});
		new_image.save(function(err, data) {
			if (err) {
				console.log(err);
				
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
				
				var newPath = __dirname + "/users/" + hash_email(user_email) + "/images/" + filename;
				
				fs.writeFile(newPath, data, function (err) {
					if (err) {
						console.log(err);
						four_oh_four(res);
						return;
					}
					console.dir(new_image);
					res.writeHead(303, {'Location': '/edit#images'});
					res.end();
					
				});
				
			});
			
		});

	});

	return;
}

function getStoreInfo(user, callback) {
	var subbed_user = hash_email(user);
	var store_data = {homePageElements: [], productsPageElements: [], products: [], images: [], settings: {page:{}}}
	
	var Images = db.model(subbed_user + "images", imageSchema);
	Images.find(function (err, image_data) {
		if (err) {
			console.error(err);
			
			callback(store_data);
			return;
		}
		store_data.images = image_data;
	
	var HomePageElements = db.model(subbed_user + "frontpages", eleList);
	HomePageElements.find(function (err, hp_data) {
		if (err) {
			console.error("banana" + err);
			
			callback(store_data);
			return;
		}
		if (hp_data[0]) {
			store_data.homePageElements = hp_data[0].elements;
		}
	
	var ProductsPageElements = db.model(subbed_user + "productpages", eleList);
	ProductsPageElements.find(function (err, pp_data) {
		if (err) {
			console.error(err);
			
			callback(store_data);
			return;
		}
		if (pp_data[0]) {
			store_data.productsPageElements = pp_data[0].elements;
		}
	
	var Products = db.model(subbed_user + "products", productList);
	Products.find(function (err, p_data) {
		if (err) {
			console.error(err);
			
			callback(store_data);
			return;
		}
		if (p_data[0]) {
			store_data.products = p_data[0].products;
		}
	
	var Settings = db.model(subbed_user + "settings", settingsSchema);
	Settings.find(function (err, s_data) {
		if (err) {
			console.error(err);
			
			callback(store_data);
			return;
		}
		if (s_data[0]) {
			store_data.settings = s_data[0];
		}
	
	var Users = db.model("users", userSchema);
	Users.findOne({"user": user}, function (err, u_data) {
		if (err) {
			console.error(err);
			
			callback(store_data);
			return;
		}
		if (u_data) {
			store_data.settings.page.pageURL = u_data.url;
		}
	
	
	callback(store_data);
	
	});
	});
	});
	});
	});
	});
}

function generate_store(email) {
	console.log("generating store for user " + email);

	function generateHeader(active_link, store_url) {
		var headerhtml = '<!DOCTYPE html><html lang="en"><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"><meta charset="utf-8"><title>%s</title><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><link href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet"><link href="/store_generic.css" rel="stylesheet"><link href="/store/'+store_url+'/store_custom.css" rel="stylesheet"></head><body><div class="navbar"><div class="container"><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="/store/'+store_url+'"><img src="/store/'+store_url+'/images/%s" height="100%" alt="Logo Image Goes Here"></a></div><div class="collapse navbar-collapse"><ul class="nav navbar-nav">';
		headerhtml += active_link == "home" ? '<li class="active">' : '<li>'
		headerhtml += '<a href="/store/'+store_url+'">Home</a></li>'
		headerhtml += active_link == "products" ? '<li class="active">' : '<li>'
		headerhtml += '<a href="/store/'+store_url+'/products">Products</a></li>'
		headerhtml += active_link == "contact" ? '<li class="active">' : '<li>'
		headerhtml += '<a href="/store/'+store_url+'/contact">Contact Us</a></li></ul><form class="navbar-form navbar-left" role="search" action="/store/'+store_url+'/search" method="get"><div class="form-group"><input type="text" class="form-control" placeholder="Search" id="q" name="q"></div> <input type="submit" class="btn btn-default" role="button" value="Submit"/></form></div></div></div><div class="main">';
		return headerhtml;
	}
	function generateFooter() {
		return '</div><div id="footer"><div class="container text-right"><p class="text-muted"><small>\u00A92014 %s. Store created with the assistance of easyStorefront.</small></p></div></div><script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script><script type="text/javascript" src="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script></body></html>';
	}
	function getFieldItem(fields, desired_key) {
		for (var i=0; i<fields.length; i++) {
			var key = Object.keys(fields[i])[0];
			if (key == desired_key) {
				return fields[i][key];
			}
		}
	}
	function processElements(elements, products, settings) {
		elementhtml = "";
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].type == "TextBlock") {
				elementhtml += util.format('<div class="container textbox"><h1>%s</h1><p class="lead">%s</p></div>', getFieldItem(elements[i].fields, 'ttitle'), getFieldItem(elements[i].fields, 'tdescription'));
			} else if (elements[i].type == "ImageBlock") {
				elementhtml += util.format('<div class="container"><p><img src="images/%s" class="img-responsive"></p></div>', getFieldItem(elements[i].fields, 'iimage'));
			} else if (elements[i].type == "ProductList") {
				elementhtml += '<div class="container"><div class="row">';
				
				for (var j = 0; j < products.length; j++) {
					elementhtml += util.format('<div class="col-sm-6 col-md-4"><div class="thumbnail"><img src="images/'+products[j].pimage+'" alt="%s"><div class="caption"><h3>%s</h3><h4>%s%s</h4><p>%s</p><p><a href="#" class="btn btn-primary" role="button">Buy Now</a> <a href="product/'+j+'" class="btn btn-default" role="button">View Details</a></p></div></div></div>', products[j].ptitle, products[j].ptitle, settings.page.pageCurrency, products[j].pprice, products[j].psdescription);
				}
				
				elementhtml += '</div></div>';
			} else if (elements[i].type == "StartShoppingButton") {
				elementhtml += '<p><a class="btn btn-lg btn-primary" href="products" role="button">Start shopping! \u00BB</a></p>';
			} else if (elements[i].type == "Carousel") {
				var id = elements[i]._id;
				elementhtml += util.format('<div class="container"><p><div id="carousel-'+id+'" class="carousel slide" data-ride="carousel"><ol class="carousel-indicators"><li data-target="#carousel-'+id+'" data-slide-to="0" class="active"></li><li data-target="#carousel-'+id+'" data-slide-to="1"></li><li data-target="#carousel-'+id+'" data-slide-to="2"></li></ol><div class="carousel-inner"><div class="item active"><img src="images/%s" alt="slide1"></div><div class="item"><img src="images/%s" alt="slide2"></div><div class="item"><img src="images/%s" alt="slide3"></div></div><a class="left carousel-control" href="#carousel-'+id+'" role="button" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a><a class="right carousel-control" href="#carousel-'+id+'" role="button" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a></div></p></div>', getFieldItem(elements[i].fields, 'cimage1'), getFieldItem(elements[i].fields, 'cimage2'), getFieldItem(elements[i].fields, 'cimage3'));
			} else {
				console.log("Unknown element type: " + elements[i].type);
			}
		}
		return elementhtml;
	}
	
	var data = getStoreInfo(email, function (data) {
	
		var api_key = 'AIzaSyByqZu8QS_XxOM5elXfF_bVye3_j2NrreQ';
	
		productlistpage = util.format(generateHeader('products', data.settings.page.pageURL), data.settings.page.pageTitle, data.settings.navbar.navbarLogo);
		data.productsPageElements.sort(function(a, b){return a.pos-b.pos}); //sort based on the pos property of the page element
		productlistpage += processElements(data.productsPageElements, data.products, data.settings);
		productlistpage += util.format(generateFooter(), data.settings.page.pageTitle);
		fs.writeFile("./users/" + hash_email(email) + "/store_products.html", productlistpage);
		
		
		
		splashpage = util.format(generateHeader('home', data.settings.page.pageURL), data.settings.page.pageTitle, data.settings.navbar.navbarLogo);
		splashpage += '<div class="container"><div class="jumbotron text-center">';
		data.homePageElements.sort(function(a, b){return a.pos-b.pos}); //sort based on the pos property of the page element
		splashpage += processElements(data.homePageElements, data.products, data.settings);
		splashpage += "</div></div>";
		splashpage += util.format(generateFooter(), data.settings.page.pageTitle);
		fs.writeFile("./users/" + hash_email(email) + "/store_splash.html", splashpage);
		
		
		
		productpage = util.format(generateHeader('', data.settings.page.pageURL), data.settings.page.pageTitle, data.settings.navbar.navbarLogo);
		productpage += util.format('<div class="container"><div class="jumbotron jumbotron_lesspadding"><div class="row"><div class="col-md-5 col-sm-6"><img src="{pimage}" class="img-responsive img-rounded"></div><div class="col-md-7 col-sm-6"><h2>{ptitle}</h2><h4>%s{pprice}</h4><p>{pldescription}</p><p><a role="button" class="btn btn-primary" href="#">Buy Now</a></p></div></div><div class="row"><div class="col-md-12 col-sm-12"><div class="tags"><div class="button_label">Tags: </div> <div class="btn-group"> {buttons}</div></div></div></div></div></div>', data.settings.page.pageCurrency);
		productpage += util.format(generateFooter(), data.settings.page.pageTitle);
		fs.writeFile("./users/" + hash_email(email) + "/store_product.html", productpage);
		
		
		
		searchpage = util.format(generateHeader('', data.settings.page.pageURL), data.settings.page.pageTitle, data.settings.navbar.navbarLogo);
		searchpage += util.format('<div class="container textbox"><h1>Search Results</h1><p class="lead">The following products were found for the query, "{search}".</p></div>');
				searchpage += '<div class="container"><div class="row">{results}</div></div>';
		searchpage += util.format(generateFooter(), data.settings.page.pageTitle);
		fs.writeFile("./users/" + hash_email(email) + "/store_search.html", searchpage);
		


		contactpage = util.format(generateHeader('contact', data.settings.page.pageURL), data.settings.page.pageTitle, data.settings.navbar.navbarLogo);
		contactpage += '<div class="container"><div class="jumbotron whitebox"><div class="row"><div class="col-md-12"><h1 class="jumbotron_lesspadding">Contact Info</h1></div></div>';
		//address
		var address = data.settings.contact.stAdd + ", " + 
			data.settings.contact.city + ", " + 
			data.settings.contact.province + ", " + 
			data.settings.contact.country;
		contactpage += util.format('<div class="row"><div class="col-md-3"><h3 class="textcenterd">Address: </h3></div><div class="col-md-9"><p class="textcenterd">%s</p></div></div>', address);
		//phone number
		if (data.settings.contact.phone != null && data.settings.contact.phone != ""){
			contactpage += util.format('<div class="row"><div class="col-md-3"><h3 class="textcenterd">Phone Number: </h3></div><div class="col-md-9"><p class="textcenterd">%s</p></div></div>', data.settings.contact.phone);
		}
		//contact email
		if (data.settings.contact.emailAdd != null && data.settings.contact.emailAdd != ""){
			contactpage += util.format('<div class="row"><div class="col-md-3"><h3 class="textcenterd">Contact Email: </h3></div><div class="col-md-9">	<p class="textcenterd">%s</p></div></div>', data.settings.contact.emailAdd);
		}
		//hours of operation
			contactpage += util.format('<div class="row"><div class="col-md-12 col-sm-12"><h2>Store Hours</h2></div></div><div class="row"><div class="col-md-12 col-sm-12"><table class="table table-bordered"><tr><td>Day of The Week</td><td>Hours</td></tr><tr><td>Monday</td><td>%s</td></tr><tr><td>Tuesday</td><td>%s</td></tr><tr><td>Wednesday</td><td>%s</td></tr><tr><td>Thursday</td><td>%s</td></tr><tr><td>Friday</td><td>%s</td></tr><tr><td>Saturday</td><td>%s</td></tr><tr><td>Sunday</td><td>%s</td></tr></table></div></div>', 
			data.settings.hours.monstart + " to "  + data.settings.hours.monend, 
			data.settings.hours.tuestart + " to " + data.settings.hours.tueend, 
			data.settings.hours.wedstart + " to "  + data.settings.hours.wedend, 
			data.settings.hours.thustart + " to "  + data.settings.hours.thuend, 
			data.settings.hours.frstart + " to "  + data.settings.hours.frend, 
			data.settings.hours.satstart + " to "  + data.settings.hours.satend, 
			data.settings.hours.sunstart + " to "  + data.settings.hours.sunend);
			
		//map
		contactpage += util.format('<div class="row"><div class="col-md-12 col-sm-12"><iframe width="600" height="450" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=%s&q=%s"></iframe></div></div></div></div>', api_key, address);
		
		contactpage += util.format(generateFooter(), data.settings.page.pageTitle);
		fs.writeFile("./users/" + hash_email(email) + "/contact_page.html", contactpage);
		
		var s = data.settings.style;
		css = util.format('.textbox {color: %s} body {background-color: %s} .navbar {background-color: %s; border-color: %s} .main, #footer {font-family: %s} .navbar .nav a, .navbar .navbar-header a {color: %s} .navbar .nav .active a {background-color: %s} #footer {background-color: %s} #footer .text-muted {color: %s} .navbar-toggle .icon-bar {background-color: %s} .navbar-toggle {border-color: %s; background-color: %s} .carousel-inner > .item > img {width: auto;height:450px;max-height : 450px;} .thumbnail > img {max-height:250px;height:250px}', s.fontcolour, s.bgcolour, s.navbarcolor, s.navbarhighlight, s.fontface, s.navbartextcolor, s.navbarhighlight, s.footercolor, s.footertext, s.navbartextcolor, s.navbartextcolor, s.navbarhighlight);
		fs.writeFile("./users/" + hash_email(email) + "/store_custom.css", css);
	});
}

function giveStaticFile(res, path) {
	fs.readFile(path, function (err,data) {
		if (err) {
			console.log(path + " should have been found, but wasn't!");
			four_oh_four(res);
		} else {
			res.writeHead(200);
			res.end(data);
		}
	});
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
				data = sanitize(data);
				console.log("received store settings edit request"); 
				res.writeHead(200);
				var pdata =JSON.parse(data);
				console.log('Updating ' + pdata.user + ' settings');
				var settings = mongoose.model(hash_email((pdata.user).trim()) + 'settings', settingsSchema);
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
						country: sdata.contact.country,
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
					},
					hasBeenGenerated: true

				});
				settings.findOne({}, function (err,q) {
					var old = null;
					if (err) {
						console.log(err + ' here');
						
						return;
					}
					else if (q != null){
					 	old = q._id;
					}
					new_settings.save(function (err) {  
						if (err) {
							console.log(err + ' or here');
							
							return;
						} else {
							if (old != null){
								settings.remove({_id: old}, function(err) {
									if (err) {
										console.log(err + ' maybe here');//this NO LONGER gets thrown for some reason
										
										return;
									}
									var new_url = sdata.page.pageURL;
									var User = mongoose.model('users', userSchema);
									var unescaped_email = pdata.user;
									User.findOne({user: unescaped_email}, function (err, item) {
										if (err || !item) {
											console.log(err);
											
											return;
										}
										item.url = sdata.page.pageURL;
										item.examplesListing = sdata.page.pageHomepageListing;
										item.save();
										
										console.log("Products saved sucessfully");
										generate_store(unescaped_email);
									});
								});}
							
						}
					});
				});
								
				res.end("Your settings changes have been saved!");
			} else if (url == "/changeproducts") {
				data = sanitize(data);
				console.log("received store products edit request"); 
				res.writeHead(200);
				var pdata =JSON.parse(data);
				console.log('Updating ' + pdata.user + ' products');
				var pdata = JSON.parse(data);
				var products = mongoose.model(hash_email((pdata.user).trim()) + 'p', productSchema);
				var pList = mongoose.model(hash_email((pdata.user).trim()) + 'products', productList);
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
						
						return;
					}
					else if (q != null){
					 	old = q._id;
					}
					new_products.save(function (err) {  
						if (err) {
							console.log(err + ' or here');
							
							return;
						} else {
							if (old != null){
								pList.remove({_id: old}, function(err) {
									if (err) {
										console.log(err + ' maybe here');//this NO LONGER gets thrown for some reason
										
										return;

									}
									
									console.log("Products saved sucessfully");
									generate_store(pdata.user);
								});}
						}
					});
				});
				
				res.end("Your product changes have been saved!");
			} else if (url == "/changefrontpage") {
				data = sanitize(data);
				console.log("received store front edit request"); 
				res.writeHead(200);
				var pdata = JSON.parse(data);
				console.log('Updating ' + pdata.user + ' frontpage');
				var edata = JSON.parse(data);
				var elements = mongoose.model('elements', eleSchema);
				var eList = mongoose.model(hash_email((pdata.user).trim()) + 'frontpage', eleList);
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
						
						return;
					}
					else if (q != null){
					 	old = q._id;
					}
					new_elements.save(function (err) {  
						if (err) {
							console.log(err + ' or here');
							
							return;
						} else {
							if (old != null){
								eList.remove({_id: old}, function(err) {
									if (err) {
										console.log(err + ' maybe here');//this NO LONGER gets thrown for some reason
										
										return;
									}
									
									console.log("frontpage saved sucessfully");
									generate_store(pdata.user);
								});}
						}
					});
					
				});

				res.end("Your Home Page changes have been saved!");

			} else if (url == "/changeproductpage") {
				data = sanitize(data);
				console.log("received store front edit request"); 
				res.writeHead(200);
				var pdata = JSON.parse(data);
				console.log('Updating ' + pdata.user + ' product page');
				var edata = JSON.parse(data);
				var elements = mongoose.model('elements', eleSchema);
				var eList = mongoose.model(hash_email((pdata.user).trim()) + 'productpage', eleList);
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
						
						return;
					}
					else if (q != null){
					 	old = q._id;
					}
					new_elements.save(function (err) {  
						if (err) {
							console.log(err + ' or here');
							
							return;
						} else {
							if (old != null){
								eList.remove({_id: old}, function(err) {
									if (err) {
										console.log(err + ' maybe here'); //this NO LONGER gets thrown for some reason
										
										return;
									}
									
									console.log("Product page saved sucessfully");
									generate_store(pdata.user);
								});}
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
			
				fs.unlink(__dirname + "/users/" + hash_email(user) + "/images/" + filename, function (err) {
					if (err) {
						console.log(err);
					}
					
					var db_name = hash_email(user) + "images";
					var Image = mongoose.model(db_name, imageSchema);
					Image.findOne({iimage: filename}).remove(function(err) {
						if (err) {
							console.log(err);
							four_oh_four(res);
							
							return;
						}
						console.log(user + "'s " + filename + " deleted");
						res.writeHead(200);
						res.end();
						
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
			giveStaticFile(res, __dirname + redirected_urls[url]);
		} else if (unchanged_urls.indexOf(url) >= 0) {
			giveStaticFile(res, __dirname + url);
		} else if (url == "/examples") {
			var User = db.model('users', userSchema);
			User.find({examplesListing: true}, function (err, items) {
				if (err) {
					console.log("there's problems " + err);
					four_oh_four(res);
					
					return;
				}
				var exampleStores = "";
				for (var i=0; i<items.length; i++) {
					exampleStores += '<li><a href="/store/'+items[i].url+'">'+items[i].url+'</a></li>';
				}
				sendPageWithSubstitutions(res,"examples.html", exampleStores);
			});
		} else if (url.substring(0,6) == "/store") {

			var thirdslash = url.indexOf("/", 7);
			if (thirdslash == -1) {
				var store_url = url.substring(7);
				var page_url = "";
			} else {
				var store_url = url.substring(7, thirdslash);
				var page_url = url.substring(thirdslash);
			}

			if (store_url == "") {
				four_oh_four(res);
				return;
			}
					
				var User = db.model('users', userSchema);
				User.findOne({url: store_url}, function (err, item) {
					if (err) {
						console.log("there's problems " + err);
						four_oh_four(res);
						
						return;
					} else if (!item) {
						console.log("store " + store_url + " does not exist!");
						four_oh_four(res);
						
						return;
					}
					store_owner = item.user;
					
					if (page_url == "/") { //store home page
						
						giveStaticFile(res, __dirname + "/users/" + hash_email(store_owner) + "/store_splash.html");
					} else if (page_url == "/products") {
						
						giveStaticFile(res, __dirname + "/users/" + hash_email(store_owner) + "/store_products.html");
					}else if (page_url == "/contact"){
						
						giveStaticFile(res, __dirname + "/users/" + hash_email(store_owner) + "/contact_page.html");
					} else if (page_url.substring(0,9) == "/product/") {
					
						var prod_num = page_url.substring(9);
					
						var db_name = hash_email(store_owner) + "products";
						var ProductList = db.model(db_name, productList);
						
						
						ProductList.findOne().exec(function(err, data) {
							if (err || !data) {
								four_oh_four(res);
								
								return;
							}
							
							fs.readFile(__dirname + "/users/" + hash_email(store_owner) + "/store_product.html", function (err,filedata) {
								if (err) {
									console.log("missing product");
									four_oh_four(res);
								} else {
									res.writeHead(200);
									var p = data.products[prod_num];
									if (p) {
										var tag_html = "";
										var tags = p.ptags.split(",");
										for (var i=0; i<tags.length; i++) {
											var tag = tags[i].trim();
											tag_html += '<a role="button" class="btn btn-default" href="../search?q='+tag+'">'+tag+'</a>';
										}
										res.end(filedata.toString().replace("{ptitle}", p.ptitle).replace("{pprice}", p.pprice).replace("{pldescription}", p.pldescription).replace("{buttons}", tag_html).replace("{pimage}", "../images/"+p.pimage));
									} else {
										four_oh_four(res);
									}
								}
							});
						});
						
						
					} else if (page_url.substring(0,7) == "/search") {
					
						var query = page_url.substring(page_url.indexOf("=")+1).toLowerCase().replace("%20", " ");
					
						var db_name = hash_email(store_owner) + "products";
						var ProductList = db.model(db_name, productList);
						
						
						ProductList.findOne().exec(function(err, data) {
							if (err || !data) {
								four_oh_four(res);
								
								return;
							}
							
							resultshtml = "";
							for (var i = 0; i < data.products.length; i++) {
								var p = data.products[i];
								if (p.ptitle.toLowerCase().indexOf(query) >= 0 || p.psdescription.toLowerCase().indexOf(query) >= 0 || p.pldescription.toLowerCase().indexOf(query) >= 0 || p.ptags.toLowerCase().indexOf(query) >= 0) {
									//matches the search
									resultshtml += util.format('<div class="col-sm-6 col-md-4"><div class="thumbnail"><img src="images/'+p.pimage+'" alt="%s"><div class="caption"><h3>%s</h3><h4>%s%s</h4><p>%s</p><p><a href="#" class="btn btn-primary" role="button">Buy Now</a> <a href="product/'+i+'" class="btn btn-default" role="button">View Details</a></p></div></div></div>', p.ptitle, p.ptitle, "$", p.pprice, p.psdescription);
								}
							}
							fs.readFile(__dirname + "/users/" + hash_email(store_owner) + "/store_search.html", function (err,filedata) {
								if (err) {
									console.log("missing search result page");
									four_oh_four(res);
								} else {
									res.writeHead(200);
									res.end(filedata.toString().replace("{results}", resultshtml).replace("{search}", query));
								}
							});
						});

					} else if (page_url == "/store_custom.css") {
						
						giveStaticFile(res, __dirname + "/users/" + hash_email(store_owner) + "/store_custom.css");
					} else if (page_url.substring(0,7) == "/images") {
						
						var img = page_url.substring(7);
						giveStaticFile(res, __dirname + "/users/" + hash_email(store_owner) + "/images/" + img);
					} else if (page_url == "") { 
						
						res.writeHead(303, {'Location': '/store/' + store_url + "/"}); //redirect from "/store/hatstore" to "/store/hatstore/" for technical reasons
						res.end();
					} else {
						
						console.log(util.format("user tried to request page '%s' from store owner '%s'.", page_url, store_owner));
						four_oh_four(res);
					} 
					
				});

			
		} else if (url.substring(0,13) == "/getstoredata") {
			res.writeHead(200, {"Content-Type": "application/json"});
			var user = url.substring(14);
			if (user == "") {
				console.log('did not specify which user\'s data');
				four_oh_four(res);
				return;
			}
			getStoreInfo(user, function (data) {
				res.end(unsanitize(JSON.stringify(data)));
			});
		} else {
			console.log("user tried to request disallowed file: " + url);
			four_oh_four(res);
		}
	}
}).listen(8080);

console.log("server running on port 8080");
