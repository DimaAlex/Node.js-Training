var domain = require('domain');
var serverDomain = domain.create();

serverDomain.on('error', function (err) {
    console.error("Domain intercepted %s", err);
});

serverDomain.run(function () {
    var server = require('./server');
    server.listen(3000);
});