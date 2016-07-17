var util = require('util');

function Animal(name) {
	this.name = name;
}

Animal.prototype.walk = function() {
	console.log("Walk " + this.name);
};

function Rabbit(name) {
	this.name = name;
}

util.inherits(Rabbit, Animal);

Rabbit.prototype.jump = function() {
	console.log("Jump " + this.name);
};

var rabbit = new Rabbit('my krolik');
rabbit.walk();
rabbit.jump();