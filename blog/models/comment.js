var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  message: {
    type: String,
    require: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  article: {
    type: Schema.ObjectId,
    ref: 'Article',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

exports.Comment = mongoose.model('Comment', schema);