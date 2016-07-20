var url = require('url');
var debug = require('debug')('server:request');

module.exports = function (req, res) {

    var urlParsed = url.parse(req.url, true);

    debug('Got request', req.method, req.url);

    if (req.method == 'GET' && urlParsed.pathname == '/echo' && urlParsed.query.message) {
        debug("Echo: " + urlParsed.query.message);
        res.end( urlParsed.query.message );
        return;
    }

    debug('Unknown URL');

    res.statusCode = 404;
    res.end("page not found");
};