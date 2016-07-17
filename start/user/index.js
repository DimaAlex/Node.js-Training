var db = require('db');
//NODE_PATH =.
var log = require('logger')(module);

function User(name){
    this.name = name;
}

User.prototype.hello = function(who){
    log(db.getPhrase('Hello') + ", " + who.name);
};

//console.log("user.js is required!");

//exports.User = User;
module.exports = User;

//console.log(module);