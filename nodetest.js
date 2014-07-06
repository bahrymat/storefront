var http = require('http'), fs = require('fs');

http.createServer(function (req, res) {
	var url
	if (req.url == "/") {
		url = "/index.html";
	} else {
		url = req.url;
	}
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
}).listen(8080);

console.log("server running on port 8080");
