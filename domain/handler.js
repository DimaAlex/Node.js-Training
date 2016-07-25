var fs = require('fs');

model.exports = function handler(req, res) {

    if (req.url == '/') {

        fs.readFile('index.html', function(err, info) {
            if (err) throw err;
            res.end(info);
        });

    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }

};