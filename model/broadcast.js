//Created By Unggul Arlin Wiryanto
//email: arlinunggul@gmail.com
var mongoose = require('mongoose');

var Schema = mongoose.Schema.Types,
	ObjectId = Schema.ObjectId;

var broadcastSchema = new mongoose.Schema({
	sender: {
		type: ObjectId,
		ref: 'User',
		required: true
	},
	created: {
		type: Date
	},
	message: {
		type: String,
		required: true
	},
	photos: [{
		type: String
	}],
	receivers: [{
		type: ObjectId,
		ref: 'User',
		required: true
	}]
}, {versionKey: false});

mongoose.model('Broadcast', broadcastSchema);