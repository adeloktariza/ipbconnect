//Created By Unggul Arlin Wiryanto
//email: arlinunggul@gmail.com
var mongoose = require('mongoose');

var Schema = mongoose.Schema.Types,
    ObjectId = Schema.ObjectId; 

var knowledgeSchema = new mongoose.Schema({
    title: {type : String, required: true},
    description: {type : String, required: true},
    category: {type: String, required: true, ref: 'KnowledgeSharingCategory'},
    cover: {type: String, required: true},
    file: {type:String, required: true},
    fileSize: String,
    totalSlide: Number,
    totalLike: Number,
    totalComment: Number,
    likers: [{
            createdBy: {
                type: ObjectId,
                ref: 'User'
            },
            created: {type: Date}
        }],
    comments: [{
            value: {type: String},
            createdBy: {
                type: ObjectId,
                ref: 'User'
            },
            replies: [
                {
                    value:{type: String},
                    createdBy: {
                        type: ObjectId,
                        ref: 'User'
                    },
                    created:{
                        type: Date
                    }   
                }
            ],
            created: {type: Date},
            totalReply: Number
        }],
    bookmarks: [{
            createdBy: {
                type: ObjectId,
                ref: 'User'
            },
            created: {
                type: Date
            }
        }],
    created: Date,
    createdBy: { type: ObjectId, required: true, ref: 'User'}
}, {versionKey: false});

mongoose.model('KnowledgeSharing', knowledgeSchema);