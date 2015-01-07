var mongoose = require('mongoose');
var Schema	 = mongoose.Schema;

var todoSchema = new Schema({
	task: String,
	status: { type: String, default: 'new' },
	date: { type: Date, default: Date.now }
});

mongoose.model('todo', todoSchema);