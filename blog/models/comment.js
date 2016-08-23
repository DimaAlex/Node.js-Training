var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  message: {
    type: String,
    require: true
  },
  userId: {
    type: Schema.ObjectId,
    required: true
  },
  articleId: {
    type: Schema.ObjectId,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

exports.Comment = mongoose.model('Comment', schema);