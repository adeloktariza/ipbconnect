var mongoose = require('mongoose');

var Schema = mongoose.Schema.Types,
    ObjectId = Schema.ObjectId; 
var profileSchema = new mongoose.Schema({  
  userId: { type: ObjectId, ref: 'User' , sparse: true, required: true},
  photo: String,
  mobileNumber: String,
  address: String,
  currentJob: String,
  interest: String,
  hobby: String,
  maritalStatus: String,
  location: String,
  latitude: String,
  longitude: String,
  modified: Date
}, { versionKey: false });


mongoose.model('Profile', profileSchema);