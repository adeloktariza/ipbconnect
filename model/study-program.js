var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId; 
var studyProgramSchema = new mongoose.Schema({
    facultyId: { type: ObjectId, ref: 'Faculty', sparse: true, required: true},   
    name: { type: String, required: true},
    created: Date,
    modified: { type: Date, default: Date.now },
    createdBy: { type: ObjectId, required: true, ref: 'User'},
    modifiedBy: { type: ObjectId, ref: 'User'}
}, { versionKey: false });


mongoose.model('StudyProgram', studyProgramSchema);