var http = require('http');
var url = require('url');

var server = new http.Server(function (req, res) {

    var urlParsed = url.parse(req.url, true);

    if (req.method == 'GET' && urlParsed.pathname == '/echo' && urlParsed.query.message) {
        res.setHeader('Cache-control', 'no-cache');
        res.end( urlParsed.query.message );
        return;
    }

    res.statusCode = 404;
    res.end("page not found");
});

server.listen(1337, '127.0.0.1');
