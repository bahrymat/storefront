var http = require('http'), fs = require('fs'), util = require('util');

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

fs.readFile("settingstest.json", function (err,data) {
	data = JSON.parse(data);
	
	
	
	productlistpage = util.format(generateHeader('products'), data.settings.page.pageTitle, data.settings.page.pageTitle);
	data.elements.sort(function(a, b){return a.pos-b.pos}); //sort based on the pos property of the page element
	for (var i = 0; i < data.elements.length; i++) {
		if (data.elements[i].type == "text") {
			productlistpage += util.format('<div class="container textbox"><h1>%s</h1><p class="lead">%s</p></div>', data.elements[i].ttitle, data.elements[i].tdescription);
		} else if (data.elements[i].type == "image") {

		} else if (data.elements[i].type == "productlist") {
			productlistpage += '<div class="container"><div class="row">';
			
			for (var j = 0; j < data.products.length; j++) {
			productlistpage += util.format('<div class="col-sm-6 col-md-4"><div class="thumbnail"><img src="example_product.png" alt="%s"><div class="caption"><h3>%s</h3><h4>%s%s</h4><p>%s</p><p><a href="#" class="btn btn-primary" role="button">Buy Now</a> <a href="example_store_product.html" class="btn btn-default" role="button">View Details</a></p></div></div></div>', data.products[j].ptitle, data.products[j].ptitle, data.settings.page.pageCurrency, data.products[j].pprice, data.products[j].psdescription);
			}
			
			productlistpage += '</div></div>';
		}
	}
	productlistpage += util.format(generateFooter(), data.settings.page.pageTitle);
	fs.writeFile("store_products.html", productlistpage);
	
	
	
	splashpage = util.format(generateHeader('home'), data.settings.page.pageTitle, data.settings.page.pageTitle);
	splashpage += util.format('<div class="container"><div class="jumbotron text-center"><h1>%s</h1><h3>%s</h3><a href="example_store_products.html"><img src="hatman.png" class="img-responsive img-center"></a><p>%s</p><a class="btn btn-lg btn-primary" href="example_store_products.html" role="button">Start shopping! \u00BB</a></div></div>', data.settings.splash.splashHead, data.settings.splash.splashSubHead, data.settings.splash.splashCaption);
	splashpage += util.format(generateFooter(), data.settings.page.pageTitle);
	fs.writeFile("store_splash.html", splashpage);
	
	
	
	productpage = util.format(generateHeader(''), data.settings.page.pageTitle, data.settings.page.pageTitle);
	productpage += util.format('<div class="container"><div class="jumbotron jumbotron_lesspadding"><div class="row"><div class="col-md-5 col-sm-6"><img src="example_product.png" class="img-responsive img-rounded"></div><div class="col-md-7 col-sm-6"><h2>{ptitle}</h2><h4>%s{pprice}</h4><p>{pldescription}</p><p><a role="button" class="btn btn-primary" href="#">Buy Now</a></p></div></div><div class="row"><div class="col-md-12 col-sm-12"><div class="tags"><div class="button_label">Tags:</div><div class="btn-group">{buttons}</div></div></div></div></div></div>', data.settings.page.pageCurrency);
	productpage += util.format(generateFooter(), data.settings.page.pageTitle);
	fs.writeFile("store_product.html", productpage);
	
	
	
	searchpage = util.format(generateHeader(''), data.settings.page.pageTitle, data.settings.page.pageTitle);
	searchpage += util.format('<div class="container textbox"><h1>Search Results</h1><p class="lead">The following products were found for the query, "{search}".</p></div>');
			searchpage += '<div class="container"><div class="row">{results}</div></div>';
	searchpage += util.format(generateFooter(), data.settings.page.pageTitle);
	fs.writeFile("store_search.html", searchpage);
	
	
	var s = data.settings.style;
	css = util.format('.textbox {color: %s} body {background-color: %s} .navbar {background-color: %s; border-color: %s} .main, #footer {font-family: %s} .navbar .nav a, .navbar .navbar-header a {color: %s} .navbar .nav .active a {background-color: %s} #footer {background-color: %s} #footer .text-muted {color: %s} .navbar-toggle .icon-bar {background-color: %s} .navbar-toggle {border-color: %s; background-color: %s}', s.fontcolour, s.bgcolour, s.navbarcolor, s.navbarhighlight, s.fontface, s.navbartextcolor, s.navbarhighlight, s.footercolor, s.footertext, s.navbartextcolor, s.navbartextcolor, s.navbarhighlight);
	fs.writeFile("store_custom.css", css);
});