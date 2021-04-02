var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema(
  {
    title: {type: String, required: true},
    timestamp: {type: Date, required: true},
    text: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true}
  }
); 

// Virtual for book's URL
PostSchema
.virtual('url')
.get(function () {
  return '/post/' + this._id;
});

//Export model
module.exports = mongoose.model('Post', PostSchema);