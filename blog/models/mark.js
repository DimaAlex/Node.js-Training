var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  number: {
    type: Number,
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

exports.Mark = mongoose.model('Mark', schema);