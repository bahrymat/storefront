var http = require('http'), fs = require('fs');



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
				/* (urlParams.signupEmail, urlParams.signupPass, urlParams.signupStoreName); */
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
