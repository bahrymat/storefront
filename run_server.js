var http = require('http'), fs = require('fs'), util = require('util'), mongoose = require('mongoose'), multiparty = require('multiparty'),
    querystring = require('querystring');
	
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
	}

});

var redirected_urls = {"/": "/index.html", "/about": "/aboutus.html", "/examples": "/examples.html", "/edit": "/settings.html", "/logout": "/logout.html"}
var unchanged_urls = ["/bootstrapvalidator-dist-0.4.5/dist/js/bootstrapValidator.js", "/index.css", "/index.js", "/settings.js",
                      "/settings.css", "/yuwei.JPG", "/keegan.jpg", "/jason.jpg", "/matt.jpg", "/exclamation.jpg", "/store_generic.css"]
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
			var new_image = new Image({ititle: pretty_name, iimage: filename});
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

function getStoreInfo(user, callback) {
	var subbed_user = user.replace(".", "_").replace("@", "__");
	var store_data = {homePageElements: [], productsPageElements: [], products: [], images: [], settings: {}}
	mongoose.connect('mongodb://localhost:8081/easyStorefront');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function () {
		console.log('Connected to MongoDB');
		
		var Images = mongoose.model(subbed_user + "images", imageSchema);
		Images.find(function (err, image_data) {
			if (err) {
				console.error(err);
				db.close();
				callback(store_data);
				return;
			}
			store_data.images = image_data;
		
		var HomePageElements = mongoose.model(subbed_user + "frontpages", eleList);
		HomePageElements.find(function (err, hp_data) {
			if (err) {
				console.error("banana" + err);
				db.close();
				callback(store_data);
				return;
			}
			if (hp_data[0]) {
				store_data.homePageElements = hp_data[0].elements;
			}
		
		var ProductsPageElements = mongoose.model(subbed_user + "productpages", eleList);
		ProductsPageElements.find(function (err, pp_data) {
			if (err) {
				console.error(err);
				db.close();
				callback(store_data);
				return;
			}
			if (pp_data[0]) {
				store_data.productsPageElements = pp_data[0].elements;
			}
		
		var Products = mongoose.model(subbed_user + "products", productList);
		Products.find(function (err, p_data) {
			if (err) {
				console.error(err);
				db.close();
				callback(store_data);
				return;
			}
			if (p_data[0]) {
				store_data.products = p_data[0].products;
			}
		
		var Settings = mongoose.model(subbed_user + "settings", settingsSchema);
		Settings.find(function (err, s_data) {
			if (err) {
				console.error(err);
				db.close();
				callback(store_data);
				return;
			}
			if (s_data[0]) {
				store_data.settings = s_data[0];
			}
		
		db.close();
		callback(store_data);
		
		});
		});
		});
		});
		});
	});
}

function generate_store(escaped_email) {
	email = escaped_email.replace("__", "@").replace("_", ".");
	console.log("generating store for user " + email);

	function generateHeader(active_link, store_url) {
		var headerhtml = '<!DOCTYPE html><html lang="en"><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"><meta charset="utf-8"><title>%s</title><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><link href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet"><link href="/store_generic.css" rel="stylesheet"><link href="/store/'+store_url+'/store_custom.css" rel="stylesheet"></head><body><div class="navbar"><div class="container"><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="/store/'+store_url+'"><img src="/store/'+store_url+'/images/%s" height="100%" alt="Logo Image Goes Here"></a></div><div class="collapse navbar-collapse"><ul class="nav navbar-nav">';
		headerhtml += active_link == "home" ? '<li class="active">' : '<li>'
		headerhtml += '<a href="/store/'+store_url+'">Home</a></li>'
		headerhtml += active_link == "products" ? '<li class="active">' : '<li>'
		headerhtml += '<a href="/store/'+store_url+'/products">Products</a></li></ul><form class="navbar-form navbar-left" role="search" action="/store/'+store_url+'/search" method="get"><div class="form-group"><input type="text" class="form-control" placeholder="Search" id="q" name="q"></div> <input type="submit" class="btn btn-default" role="button" value="Submit"/></form></div></div></div><div class="main">';
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
				console.log("Image not implemented");
			} else if (elements[i].type == "ProductList") {
				elementhtml += '<div class="container"><div class="row">';
				
				for (var j = 0; j < products.length; j++) {
					elementhtml += util.format('<div class="col-sm-6 col-md-4"><div class="thumbnail"><img src="example_product.png" alt="%s"><div class="caption"><h3>%s</h3><h4>%s%s</h4><p>%s</p><p><a href="#" class="btn btn-primary" role="button">Buy Now</a> <a href="product/'+j+'" class="btn btn-default" role="button">View Details</a></p></div></div></div>', products[j].ptitle, products[j].ptitle, settings.page.pageCurrency, products[j].pprice, products[j].psdescription);
				}
				
				elementhtml += '</div></div>';
			} else if (elements[i].type == "StartShoppingButton") {
				elementhtml += '<p><a class="btn btn-lg btn-primary" href="products" role="button">Start shopping! \u00BB</a></p>';
			} else if (elements[i].type == "Carousel") {
				console.log("ImageCarousel not implemented");
			} else {
				console.log("Unknown element type: " + elements[i].type);
			}
		}
		return elementhtml;
	}
	
	var data = getStoreInfo(email, function (data) {
	
		productlistpage = util.format(generateHeader('products', data.settings.page.pageURL), data.settings.page.pageTitle, data.settings.navbar.navbarLogo);
		data.productsPageElements.sort(function(a, b){return a.pos-b.pos}); //sort based on the pos property of the page element
		productlistpage += processElements(data.productsPageElements, data.products, data.settings);
		productlistpage += util.format(generateFooter(), data.settings.page.pageTitle);
		fs.writeFile("./users/" + email + "/store_products.html", productlistpage);
		
		
		
		splashpage = util.format(generateHeader('home', data.settings.page.pageURL), data.settings.page.pageTitle, data.settings.navbar.navbarLogo);
		splashpage += '<div class="container"><div class="jumbotron text-center">';
		data.homePageElements.sort(function(a, b){return a.pos-b.pos}); //sort based on the pos property of the page element
		splashpage += processElements(data.homePageElements, data.products, data.settings);
		splashpage += "</div></div>";
		splashpage += util.format(generateFooter(), data.settings.page.pageTitle);
		fs.writeFile("./users/" + email + "/store_splash.html", splashpage);
		
		
		
		productpage = util.format(generateHeader('', data.settings.page.pageURL), data.settings.page.pageTitle, data.settings.navbar.navbarLogo);
		productpage += util.format('<div class="container"><div class="jumbotron jumbotron_lesspadding"><div class="row"><div class="col-md-5 col-sm-6"><img src="example_product.png" class="img-responsive img-rounded"></div><div class="col-md-7 col-sm-6"><h2>{ptitle}</h2><h4>%s{pprice}</h4><p>{pldescription}</p><p><a role="button" class="btn btn-primary" href="#">Buy Now</a></p></div></div><div class="row"><div class="col-md-12 col-sm-12"><div class="tags"><div class="button_label">Tags: </div> <div class="btn-group"> {buttons}</div></div></div></div></div></div>', data.settings.page.pageCurrency);
		productpage += util.format(generateFooter(), data.settings.page.pageTitle);
		fs.writeFile("./users/" + email + "/store_product.html", productpage);
		
		
		
		searchpage = util.format(generateHeader('', data.settings.page.pageURL), data.settings.page.pageTitle, data.settings.navbar.navbarLogo);
		searchpage += util.format('<div class="container textbox"><h1>Search Results</h1><p class="lead">The following products were found for the query, "{search}".</p></div>');
				searchpage += '<div class="container"><div class="row">{results}</div></div>';
		searchpage += util.format(generateFooter(), data.settings.page.pageTitle);
		fs.writeFile("./users/" + email + "/store_search.html", searchpage);
		
		
		var s = data.settings.style;
		css = util.format('.textbox {color: %s} body {background-color: %s} .navbar {background-color: %s; border-color: %s} .main, #footer {font-family: %s} .navbar .nav a, .navbar .navbar-header a {color: %s} .navbar .nav .active a {background-color: %s} #footer {background-color: %s} #footer .text-muted {color: %s} .navbar-toggle .icon-bar {background-color: %s} .navbar-toggle {border-color: %s; background-color: %s}', s.fontcolour, s.bgcolour, s.navbarcolor, s.navbarhighlight, s.fontface, s.navbartextcolor, s.navbarhighlight, s.footercolor, s.footertext, s.navbartextcolor, s.navbartextcolor, s.navbarhighlight);
		fs.writeFile("./users/" + email + "/store_custom.css", css);
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
										console.log(err + ' maybe here');//this NO LONGER gets thrown for some reason
										db.close();
										return;
									}
									var new_url = sdata.page.pageURL;
									var User = mongoose.model('users', userSchema);
									var unescaped_email = pdata.user.replace("__", "@").replace("_", ".");
									User.findOne({user: unescaped_email}, function (err, item) {
										if (err || !item) {
											console.log(err);
											db.close();
											return;
										}
										item.url = sdata.page.pageURL;
										item.save();
										db.close();
										console.log("Products saved sucessfully");
										generate_store(pdata.user);
									});
								});}
							
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
										console.log(err + ' maybe here');//this NO LONGER gets thrown for some reason
										db.close();
										return;

									}
									db.close();
									console.log("Products saved sucessfully");
									generate_store(pdata.user);
								});}
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
										console.log(err + ' maybe here');//this NO LONGER gets thrown for some reason
										db.close();
										return;
									}
									db.close();
									console.log("frontpage saved sucessfully");
									generate_store(pdata.user);
								});}
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
										console.log(err + ' maybe here'); //this NO LONGER gets thrown for some reason
										db.close();
										return;
									}
									db.close();
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
			giveStaticFile(res, __dirname + redirected_urls[url]);
		} else if (unchanged_urls.indexOf(url) >= 0) {
			giveStaticFile(res, __dirname + url);
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
					
			var db = mongoose.createConnection('mongodb://localhost:8081/easyStorefront');
			db.on('error', console.error.bind(console, 'connection error:'));
			db.once('open', function callback () {
				var User = db.model('users', userSchema);
				User.findOne({url: store_url}, function (err, item) {
					if (err) {
						console.log("there's problems " + err);
						four_oh_four(res);
						db.close();
						return;
					} else if (!item) {
						console.log("store " + store_url + " does not exist!");
						four_oh_four(res);
						db.close();
						return;
					}
					store_owner = item.user;
					
					if (page_url == "/") { //store home page
						db.close();
						giveStaticFile(res, __dirname + "/users/" + store_owner + "/store_splash.html");
					} else if (page_url == "/products") {
						db.close();
						giveStaticFile(res, __dirname + "/users/" + store_owner + "/store_products.html");
					} else if (page_url.substring(0,9) == "/product/") {
					
						var prod_num = page_url.substring(9);
					
						var db_name = store_owner.replace(".", "_").replace("@", "__") + "products";
						var ProductList = db.model(db_name, productList);
						
						
						ProductList.findOne().exec(function(err, data) {
							if (err || !data) {
								four_oh_four(res);
								db.close();
								return;
							}
							db.close();
							fs.readFile(__dirname + "/users/" + store_owner + "/store_product.html", function (err,filedata) {
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
										res.end(filedata.toString().replace("{ptitle}", p.ptitle).replace("{pprice}", p.pprice).replace("{pldescription}", p.pldescription).replace("{buttons}", tag_html));
									} else {
										four_oh_four(res);
									}
								}
							});
						});
						
						
					} else if (page_url.substring(0,7) == "/search") {
					
						var query = page_url.substring(page_url.indexOf("=")+1).toLowerCase();
					
						var db_name = store_owner.replace(".", "_").replace("@", "__") + "products";
						var ProductList = db.model(db_name, productList);
						
						
						ProductList.findOne().exec(function(err, data) {
							if (err || !data) {
								four_oh_four(res);
								db.close();
								return;
							}
							db.close();
							resultshtml = "";
							for (var i = 0; i < data.products.length; i++) {
								var p = data.products[i];
								if (p.ptitle.toLowerCase().indexOf(query) >= 0 || p.psdescription.toLowerCase().indexOf(query) >= 0 || p.pldescription.toLowerCase().indexOf(query) >= 0 || p.ptags.toLowerCase().indexOf(query) >= 0) {
									//matches the search
									resultshtml += util.format('<div class="col-sm-6 col-md-4"><div class="thumbnail"><img src="example_product.png" alt="%s"><div class="caption"><h3>%s</h3><h4>%s%s</h4><p>%s</p><p><a href="#" class="btn btn-primary" role="button">Buy Now</a> <a href="product/'+i+'" class="btn btn-default" role="button">View Details</a></p></div></div></div>', p.ptitle, p.ptitle, "$", p.pprice, p.psdescription);
								}
							}
							fs.readFile(__dirname + "/users/" + store_owner + "/store_search.html", function (err,filedata) {
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
						db.close();
						giveStaticFile(res, __dirname + "/users/" + store_owner + "/store_custom.css");
					} else if (page_url.substring(0,7) == "/images") {
						db.close();
						var img = page_url.substring(7);
						giveStaticFile(res, __dirname + "/users/" + store_owner + "/images/" + img);
					} else if (page_url == "") { 
						db.close();
						res.writeHead(303, {'Location': '/store/' + store_url + "/"}); //redirect from "/store/hatstore" to "/store/hatstore/" for technical reasons
						res.end();
					} else {
						db.close();
						console.log(util.format("user tried to request page '%s' from store owner '%s'.", page_url, store_owner));
						four_oh_four(res);
					} 
					
				});
			});

			
		} else if (url.substring(0,13) == "/getstoredata") {
			res.writeHead(200, {"Content-Type": "application/json"});
			var user = url.substring(14);
			if (user == "") {
				four_oh_four(res);
				return;
			}
			getStoreInfo(user, function (data) {
				res.end(JSON.stringify(data));
			});
		} else {
			console.log("user tried to request disallowed file: " + url);
			four_oh_four(res);
		}
	}
}).listen(8080);

console.log("server running on port 8080");
