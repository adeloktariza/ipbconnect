//Created By Unggul Arlin Wiryanto
//email: arlinunggul@gmail.com
var mongoose = require('mongoose');

var Schema = mongoose.Schema.Types,
ObjectId = Schema.ObjectId; 

var knowledgeCatSchema = new mongoose.Schema({
	name: {type: String, required: true},
	created: Date,
	createdBy: { type: ObjectId, required: true, ref: 'User'}
}, {versionKey: false});

mongoose.model('KnowledgeSharingCategory', knowledgeCatSchema);