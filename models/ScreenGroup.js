const mongoose = require("mongoose");

const ScreenGroupSchema = new mongoose.Schema({
	name: String,
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	screens: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Screen",
		},
	],
	isPlaying: {
		type: Boolean,
		default: false,
	},
	document: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Document",
	},
	dateCreated: {
		type: Date,
		default: Date.now,
	},
	dateModified: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("ScreenGroup", ScreenGroupSchema);
