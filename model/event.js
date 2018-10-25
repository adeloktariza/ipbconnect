var mongoose = require('mongoose');

var Schema = mongoose.Schema.Types,
    ObjectId = Schema.ObjectId; 
var eventSchema = new mongoose.Schema({  
    title: { type: String, required: true},
    place: { type: String, required: true},
    latitude: { type: String },
    longitude: { type: String },
    startDate: { type: Date, required: true},
    endDate: { type: Date },
    startTime: { type: String, required: true},
    endTime: { type: String },
    description: { type: String, required: true},
    contact: { type: String, required: true},
    price: { type: Number, required: true},
    picture: String,
    created: { type: Date, default: Date.now },
    createdBy: { type: ObjectId, required: true, ref: 'User'}
}, { versionKey: false });


mongoose.model('Event', eventSchema);