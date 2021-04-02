var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    membershipStatus:{type: String},
    secretToken:{type: String}
  }
); 

// Virtual for book's URL
UserSchema
.virtual('url')
.get(function () {
  return '/user/' + this._id;
});

//fullname
UserSchema.virtual('fullname')
.get(function() {
  return this.firstName + ' ' + this.lastName;
});

//Export model
module.exports = mongoose.model('User', UserSchema);