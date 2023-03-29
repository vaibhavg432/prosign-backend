const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
	name: String,
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	documents: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Document",
		},
	],
	dateCreated: {
		type: Date,
		default: Date.now,
	},
	dateModified: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
