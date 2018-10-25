var mongoose = require('mongoose');

var Schema = mongoose.Schema.Types,
    ObjectId = Schema.ObjectId; 
var vacancySchema = new mongoose.Schema({  
    title: { type: String, required: true},
    company: { type: String, required: true},
    closeDate: { type: Date, required: true},
    email: { type: String, required: true},
    subject: { type: String, required: true},
    companyProfile: String,
    jobQualification: String,
    jobDescription: String,
    salaryMax: Number,
    salaryMin: Number,
    jobLocationId: { type: ObjectId, ref: 'JobLocation' ,sparse: true, required: true},
    file: { type: String, required: true},
    address: { type: String, required: true},
    created: { type: Date, default: Date.now },
    createdBy: { type: ObjectId, required: true, ref: 'User'}
}, { versionKey: false });


mongoose.model('Vacancy', vacancySchema);