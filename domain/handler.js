var redis = require('redis').createClient();

module.exports = function handler(req, res) {

    if (req.url == '/') {
        redis.get("data", process.domain.bind(function (err) {
            throw  new Error("redis callback");
        }));

        // fs.readFile('index.html', function(err, info) {
        //     if (err) throw err;
        //     res.end(info);
        // });

    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }

};