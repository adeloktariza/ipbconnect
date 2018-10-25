//Created By Unggul Arlin Wiryanto
//email: arlinunggul@gmail.com
var mongoose = require('mongoose');

var Schema = mongoose.Schema.Types,
    ObjectId = Schema.ObjectId; 

var newsSchema = new mongoose.Schema({
	title: {type: String, require: true},
	created: {type: Date},
	createdBy: { type: ObjectId, required: true, ref:'User'},
	photos: [{type: String}],
	content: {type: String, required: true},
	totalComment: Number,
	comments: [{
		value: {type: String},
		createdBy: {type: ObjectId, ref: 'User'},
		created: {type: Date}
	}]
}, {versionKey: false});

mongoose.model('News', newsSchema);