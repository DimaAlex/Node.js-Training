var user = require('./user');
//require('./user');

//var dima = new User("Dima");
var dima = new user.User("Dima");
var alex = new user.User('Alex');

dima.hello(alex);
