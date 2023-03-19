const mongoose = require("mongoose");

//enums for active status
const activeStatus = Object.freeze({
	active: "active",
	inactive: "inactive",
});

const screenSchema = new mongoose.Schema({
	screenName: String,
	username: String,
	password: String,
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	status: {
		type: String,
		enum: Object.values(activeStatus),
		default: activeStatus.inactive,
	},
	document: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Document",
	},
	location: String,
	isUpdated: {
		type: Number,
		default: 0,
	},
	isPlaying: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("Screen", screenSchema);
