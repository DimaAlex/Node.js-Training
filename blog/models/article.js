var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: {
    type: String,
    unique: true,
    require: true
  },
  body: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});