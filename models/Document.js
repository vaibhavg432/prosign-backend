const mongooes = require("mongoose");

const DocumentSchema = new mongooes.Schema({
	link: String,
	name: String,
	type: String,
	userId: {
		type: mongooes.Schema.Types.ObjectId,
		ref: "User",
	},
	screenId: {
		type: mongooes.Schema.Types.ObjectId,
		ref: "Screen",
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Document = mongooes.model("document", DocumentSchema);
