var http = require('http'), fs = require('fs');

http.createServer(function (req, res) {
	fs.readFile(__dirname + req.url, function (err,data) {
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
}).listen(80);