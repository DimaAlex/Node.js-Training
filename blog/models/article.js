var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: {
    type: String,
    require: true
  },
  body: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: Schema.ObjectId,
    required: true
  }
});

exports.Article = mongoose.model('Article', schema);