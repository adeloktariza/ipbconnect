var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId; 
var facultySchema = new mongoose.Schema({ 
  name: { type: String, required: true },
  created: Date,
  modified: Date,
  createdBy: { type: ObjectId, required: true, ref: 'User'},
  modifiedBy: { type: ObjectId, ref: 'User'}
}, { versionKey: false });


mongoose.model('Faculty', facultySchema);