const User = require("../models/User");
const Screen = require("../models/Screen");
const Document = require("../models/Document");

//All Normal Users with role: user
const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({ role: "user" }).select("-password");
		res.status(200).json({
			success: true,
			message: "All users",
			users: users,
		});
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

const totalNumberOfScreens = async (req, res) => {
	try {
		const screens = await Screen.find();
		console.log(screens.length);
		res.status(200).json({
			success: true,
			message: "Total number of screens",
			screens: screens,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const currentPlayingScreens = async (req, res) => {
	try {
		const screens = await Screen.find({ isPlaying: true });
		res.status(200).json({
			success: true,
			message: "Current playing screens",
			screens: screens,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const updateScreenLimitforUser = async (req, res) => {
	const { userId } = req.params;
	const { screenLimit } = req.body;
	try {
		console.log(userId, screenLimit	)
		const user = await User.find({ _id: userId });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const newScreenLimit = screenLimit + user.screenLimit;
		const updatedUser = await User.findOneAndUpdate(
			{ _id: userId },
			{ screenLimit:  newScreenLimit},
			{ new: true },
		);

		res.status(200).json({
			success: true,
			message: "Screen Limit updated",
			user: updatedUser,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const toggleStatusOfUser = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const status = user.status;
		if (status === "active") {
			user.status = "inactive";
		} else {
			user.status = "active";
		}

		const updatedUser = await user.save();

		res.status(200).json({
			success: true,
			message: "User status updated",
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
	totalNumberOfScreens,
	currentPlayingScreens,
	removeUser,
	toggleStatusOfUser,
	updateScreenLimitforUser,
	viewScreensOfOneUser,
};
