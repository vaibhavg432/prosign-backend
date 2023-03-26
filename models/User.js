const mongoose = require("mongoose");

//enum: ["user", "admin", "superadmin"],

const userType = Object.freeze({
	user: "user",
	admin: "admin",
	superadmin: "superadmin",
});

const activeStatus = Object.freeze({
	active: "active",
	inactive: "inactive",
});

const UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	date: {
		type: Date,
		default: Date.now,
	},
	address: {
		type: String,
		default: "",
	},
	phone: {
		type: String,
		default: "",
	},
	role: {
		type: String,
		enum: Object.values(userType),
		default: userType.user,
	},
	status: {
		type: String,
		enum: Object.values(activeStatus),
		default: activeStatus.active,
	},
	avatar: {
		type: String,
		default: "",
	},
	bio: {
		type: String,
		default: "",
	},
	social: {
		facebook: String,
		twitter: String,
		instagram: String,
		linkedin: String,
		youtube: String,
	},
	screenCount: {
		type: Number,
		default: 0,
	},
	screenLimit: {
		type: Number,
		default: 0,
	},
	screens: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Screen",
		},
	],
});

module.exports = User = mongoose.model("user", UserSchema);
