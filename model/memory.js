var mongoose = require('mongoose');

var Schema = mongoose.Schema.Types,
    ObjectId = Schema.ObjectId; 
var memorySchema = new mongoose.Schema({  
    caption: { type: String, required: true},
    photo: { type: String, required: true},
    totalLike: Number,
    likers: [
        {
            createdBy: {
                type: ObjectId,
                ref: 'User'
            },
            created: {
                type: Date
            },
        }
    ],
    comments: [
        {
            value: {
                type: String
            },
            createdBy: {
                type: ObjectId,
                ref: 'User'
            },
            created: {
                type: Date
            },
        }
    ],
    created: Date,
    createdBy: { type: ObjectId, required: true, ref: 'User'}
}, { versionKey: false });


mongoose.model('Memory', memorySchema);