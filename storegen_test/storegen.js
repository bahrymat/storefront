var http = require('http'), fs = require('fs'), util = require('util'), mongoose = require('mongoose');




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
var Products = mongoose.model('foo16__bar_comproducts', productSchema);
var Settings = mongoose.model('foo16__bar_comsettings', settingsSchema);

mongoose.connect('mongodb://localhost:8081/easyStorefront');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('Connected to MongoDB');
	Products.find(function (err, product_data) {
		if (err) {
			console.error(err);
			db.close();
			return;
		}
		Settings.find(function (err, settings_data) {
			if (err) {
				console.error(err);
				db.close();
				return;
			}
			db.close();
			generate_store(product_data[0].toObject().products, settings_data[0].toObject());
		});
	});
});



function generateHeader(active_link) {
	var headerhtml = '<!DOCTYPE html><html lang="en"><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"><meta charset="utf-8"><title>%s</title><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><link href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet"><link href="example_store.css" rel="stylesheet"><link href="store_custom.css" rel="stylesheet"></head><body><div class="navbar"><div class="container"><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="example_store_home.html"><img src="example_store_logo.png" height="100%" alt="%s"></a></div><div class="collapse navbar-collapse"><ul class="nav navbar-nav">'
	headerhtml += active_link == "home" ? '<li class="active">' : '<li>'
	headerhtml += '<a href="example_store_home.html">Home</a></li>'
	headerhtml += active_link == "products" ? '<li class="active">' : '<li>'
	headerhtml += '<a href="example_store_products.html">Products</a></li></ul><form class="navbar-form navbar-left" role="search"><div class="form-group"><input type="text" class="form-control" placeholder="Search"></div> <a class="btn btn-default" href="example_store_searchresults.html" role="button">Submit</a></form></div></div></div><div class="main">';
	return headerhtml;
}

function generateFooter() {
	return '</div><div id="footer"><div class="container text-right"><p class="text-muted"><small>\u00A92014 %s. Store created with the assistance of easyStorefront.</small></p></div></div><script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script><script type="text/javascript" src="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script></body></html>';
}

function processElements(elements, products, settings) {
	elementhtml = "";
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].type == "TextBlock") {
			elementhtml += util.format('<div class="container textbox"><h1>%s</h1><p class="lead">%s</p></div>', elements[i].ttitle, elements[i].tdescription);
		} else if (elements[i].type == "ImageBlock") {
			console.log("Image not implemented");
		} else if (elements[i].type == "ProductList") {
			elementhtml += '<div class="container"><div class="row">';
			
			for (var j = 0; j < products.length; j++) {
			elementhtml += util.format('<div class="col-sm-6 col-md-4"><div class="thumbnail"><img src="example_product.png" alt="%s"><div class="caption"><h3>%s</h3><h4>%s%s</h4><p>%s</p><p><a href="#" class="btn btn-primary" role="button">Buy Now</a> <a href="example_store_product.html" class="btn btn-default" role="button">View Details</a></p></div></div></div>', products[j].ptitle, products[j].ptitle, settings.page.pageCurrency, products[j].pprice, products[j].psdescription);
			}
			
			elementhtml += '</div></div>';
		} else if (elements[i].type == "StartShoppingButton") {
			elementhtml += '<p><a class="btn btn-lg btn-primary" href="/products" role="button">Start shopping! \u00BB</a></p>';
		} else if (elements[i].type == "Carousel") {
			console.log("ImageCarousel not implemented");
		} else {
			console.log("Unknown element type: " + elements[i].type);
		}
	}
	return elementhtml;
}

function generate_store(product_data, settings_data) {

	console.log('---------');
	console.log(product_data);
	console.log(settings_data);

	fs.readFile("settingstest.json", function (err,data) { //data that isn't implemented into the database yet
		data = JSON.parse(data);
		
		
		
		productlistpage = util.format(generateHeader('products'), settings_data.page.pageTitle, settings_data.page.pageTitle);
		data.productsPageElements.sort(function(a, b){return a.pos-b.pos}); //sort based on the pos property of the page element
		productlistpage += processElements(data.productsPageElements, product_data, settings_data);
		productlistpage += util.format(generateFooter(), settings_data.page.pageTitle);
		fs.writeFile("store_products.html", productlistpage);
		
		
		
		splashpage = util.format(generateHeader('home'), settings_data.page.pageTitle, settings_data.page.pageTitle);
		splashpage += '<div class="container"><div class="jumbotron text-center">';
		data.homePageElements.sort(function(a, b){return a.pos-b.pos}); //sort based on the pos property of the page element
		splashpage += processElements(data.homePageElements, product_data, settings_data);
		splashpage += "</div></div>";
		splashpage += util.format(generateFooter(), settings_data.page.pageTitle);
		fs.writeFile("store_splash.html", splashpage);
		
		
		
		productpage = util.format(generateHeader(''), settings_data.page.pageTitle, settings_data.page.pageTitle);
		productpage += util.format('<div class="container"><div class="jumbotron jumbotron_lesspadding"><div class="row"><div class="col-md-5 col-sm-6"><img src="example_product.png" class="img-responsive img-rounded"></div><div class="col-md-7 col-sm-6"><h2>{ptitle}</h2><h4>%s{pprice}</h4><p>{pldescription}</p><p><a role="button" class="btn btn-primary" href="#">Buy Now</a></p></div></div><div class="row"><div class="col-md-12 col-sm-12"><div class="tags"><div class="button_label">Tags:</div><div class="btn-group">{buttons}</div></div></div></div></div></div>', settings_data.page.pageCurrency);
		productpage += util.format(generateFooter(), settings_data.page.pageTitle);
		fs.writeFile("store_product.html", productpage);
		
		
		
		searchpage = util.format(generateHeader(''), settings_data.page.pageTitle, settings_data.page.pageTitle);
		searchpage += util.format('<div class="container textbox"><h1>Search Results</h1><p class="lead">The following products were found for the query, "{search}".</p></div>');
				searchpage += '<div class="container"><div class="row">{results}</div></div>';
		searchpage += util.format(generateFooter(), settings_data.page.pageTitle);
		fs.writeFile("store_search.html", searchpage);
		
		
		var s = settings_data.style;
		css = util.format('.textbox {color: %s} body {background-color: %s} .navbar {background-color: %s; border-color: %s} .main, #footer {font-family: %s} .navbar .nav a, .navbar .navbar-header a {color: %s} .navbar .nav .active a {background-color: %s} #footer {background-color: %s} #footer .text-muted {color: %s} .navbar-toggle .icon-bar {background-color: %s} .navbar-toggle {border-color: %s; background-color: %s}', s.fontcolour, s.bgcolour, s.navbarcolor, s.navbarhighlight, s.fontface, s.navbartextcolor, s.navbarhighlight, s.footercolor, s.footertext, s.navbartextcolor, s.navbartextcolor, s.navbarhighlight);
		fs.writeFile("store_custom.css", css);
	});
}