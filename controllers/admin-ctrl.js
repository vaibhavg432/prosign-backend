const User = require("../models/User");
const SCreen = require("../models/Screen");
const Document = require("../models/Document");

//All Normal Users with role: user
const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({ role: "user" }).select("-password");
		res.json(users);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

//All Admin Users with role: admin
const getAllAdmins = async (req, res) => {
	try {
		const admins = await User.find({ role: "admin" }).select("-password");
		res.status(200).json(admins);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const updateScreenCountforUser = async (req, res) => {
	const { id } = req.user;
	const { screenCount } = req.body;
	try {
		const user = await User.find({ _id: id });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const updatedUser = await User.findOneAndUpdate(
			{ _id: id },
			{ screenCount: screenCount },
			{ new: true },
		);

		res.status(200).json({
			success: true,
			message: "Screen count updated",
			user: updatedUser,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const viewScreensOfOneUser = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const screens = await Screen.find({ userId: id });
		res.status(200).json({
			success: true,
			message: "Screens of the user",
			screens: screens,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const removeUser = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const screens = await Screen.find({ userId: id });
		const documents = await Document.find({ userId: id });
		//removing all screens of the user
		screens.forEach(async (screen) => {
			await screen.remove();
		});

		//removing all documents of the user
		documents.forEach(async (document) => {
			await document.remove();
		});

		//removing the user
		await user.remove();

		res.status(200).json({
			success: true,
			message: "User removed",
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = {
	getAllUsers,
	getAllAdmins,
	removeUser,
	updateScreenCountforUser,
	viewScreensOfOneUser,
};
