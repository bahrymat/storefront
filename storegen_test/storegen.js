var http = require('http'), fs = require('fs'), util = require('util');

fs.readFile("settingstest.json", function (err,data) {
	data = JSON.parse(data);
	storehtml = '<!DOCTYPE html><html lang="en"><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"><meta charset="utf-8"><title>Henry Hatsworth"s Hat Emporium - Home</title><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><link href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet"><link href="example_store.css" rel="stylesheet"></head><body><div class="navbar navbar-custom"><div class="container"><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="example_store_home.html"><img src="example_store_logo.png" height="100%" alt="Name of the store company"></a></div><div class="collapse navbar-collapse"><ul class="nav navbar-nav"><li><a href="example_store_home.html">Home</a></li><li class="active"><a href="example_store_products.html">Products</a></li></ul><form class="navbar-form navbar-left" role="search"><div class="form-group"><input type="text" class="form-control" placeholder="Search"></div><a class="btn btn-default" href="example_store_searchresults.html" role="button">Submit</a></form></div></div></div>';
	data.elements.sort(function(a, b){return a.pos-b.pos}); //sort based on the pos property of the page element
	for (var i = 0; i < data.elements.length; i++) {
		if (data.elements[i].type == "text") {
			storehtml += util.format('<div class="container"><h1>%s</h1><p class="lead">%s</p></div>', data.elements[i].ttitle, data.elements[i].tdescription);
		} else if (data.elements[i].type == "image") {

		} else if (data.elements[i].type == "productlist") {
			storehtml += '<div class="container"><div class="row">';
			
			for (var j = 0; j < data.products.length; j++) {
			storehtml += util.format('<div class="col-sm-6 col-md-4"><div class="thumbnail"><img src="example_product.png" alt="%s"><div class="caption"><h3>%s</h3><h4>%s%s</h4><p>%s</p><p><a href="#" class="btn btn-primary" role="button">Buy Now</a><a href="example_store_product.html" class="btn btn-default" role="button">View Details</a></p></div></div></div>', data.products[j].ptitle, data.products[j].ptitle, data.settings.page.pageCurrency, data.products[j].pprice, data.products[j].psdescription);
			}
			
			storehtml += '</div></div>';
		}
	}
	storehtml += '<div id="footer"><div class="container text-right"><p class="text-muted"><small>\u00A92014 Hat Company. Store created with the assistance of easyStorefront.</small></p></div></div><script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script><script type="text/javascript" src="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script></body></html>';
	fs.writeFile("store.html", storehtml);
});