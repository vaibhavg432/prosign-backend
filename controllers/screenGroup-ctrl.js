const User = require("../models/User");
const ScreenGroup = require("../models/ScreenGroup");
const Screen = require("../models/Screen");

const getAllScreenGroupsForUser = async (req, res) => {
	const { id } = req.user;
	try {
		const screens = await ScreenGroup.find({ userId: id });
		return res.status(200).json({
			success: true,
			message: "All screen groups for user",
			screens: screens,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const getAllUngroupedScreensForUser = async (req, res) => {
	const { id } = req.user;
	try {
		const screens = await Screen.find({ userId: id, isGrouped: false });
		return res.status(200).json({
			success: true,
			message: "All ungrouped screens for user",
			screens: screens,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const createAScreenGroupForUser = async (req, res) => {
	const { id } = req.user;
	const { name, screens } = req.body;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}
		if(screens.length < 1) {
			return res.status(200).json({
				success: false,
				message: "No screens selected",
			});
		}
		const screenG = await ScreenGroup.findOne({ name: name, userId: id });
		if (screenG) {
			return res.status(200).json({
				success: false,
				message: "Screen group already exists",
			});
		}

		const screenGroup = new ScreenGroup({
			name: name,
			userId: id,
			screens: screens,
			dateCreated: Date.now(),
			dateModified: Date.now(),
		});

		await screenGroup.save();
		const screenGr = await ScreenGroup.findOne({ name: name, userId: id });

		for (let i = 0; i < screens.length; i++) {
			const screen = await Screen.findById(screens[i]);
			if (!screen) {
				return res.status(200).json({
					success: false,
					message: "Screen not found",
				});
			}

			if (screen.userId != id) {
				return res.status(200).json({
					success: false,
					message: "Screen does not belong to user",
				});
			}

			screen.isGrouped = true;
			screen.groupId = screenGr._id;
			await screen.save();
		}

		res.status(200).json({
			success: true,
			message: "Screen group created",
			screenGroup: screenGroup,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const editAScreenGroupForUser = async (req, res) => {
	const { id } = req.user;
	const { groupId } = req.params;
	const { name, screens } = req.body;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(200).json({
				success: false,
				message: "User not found",
			});
		}

		const screenGroup = await ScreenGroup.findById(groupId);
		if (!screenGroup) {
			return res.status(200).json({
				success: false,
				message: "Screen group not found",
			});
		}

		const checkScreenGroup = await ScreenGroup.findOne({
			name: name,
			userId: id,
		});

		if (checkScreenGroup && checkScreenGroup._id != groupId) {
			return res.status(200).json({
				success: false,
				message: `Screen group with ${name} already exists`,
			});
		}

		for (let i = 0; i < screenGroup.screens.length; i++) {
			const screen = await Screen.findById(screenGroup.screens[i]);
			if (!screen) {
				return res.status(200).json({
					success: false,
					message: "Screen not found",
				});
			}

			if (screen.userId != id) {
				return res.status(200).json({
					success: false,
					message: "Screen does not belong to user",
				});
			}

			screen.isGrouped = false;
			screen.groupId = null;
			await screen.save();
		}

		screenGroup.name = name;
		screenGroup.screens = screens;

		await screenGroup.save();

		for (let i = 0; i < screens.length; i++) {
			const screen = await Screen.findById(screens[i]);
			if (!screen) {
				return res.status(200).json({
					success: false,
					message: "Screen not found",
				});
			}

			if (screen.userId != id) {
				return res.status(200).json({
					success: false,
					message: "Screen does not belong to user",
				});
			}

			screen.isGrouped = true;
			screen.groupId = screenGroup._id;
			await screen.save();
		}

		res.status(200).json({
			success: true,
			message: "Screen group updated",
			screenGroup: screenGroup,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const deleteAScreenGroupForUser = async (req, res) => {
	const { groupId } = req.params;
	try {
		const screenGroup = await ScreenGroup.findById(groupId);
		console.log(screenGroup);
		if (!screenGroup) {
			return res.status(200).json({
				success: false,
				message: "Screen group not found",
			});
		}

		for (let i = 0; i < screenGroup.screens.length; i++) {
			const screen = await Screen.findById(screenGroup.screens[i]);
			screen.isGrouped = false;
			screen.groupId = null;
			await screen.save();
		}

		await ScreenGroup.findByIdAndDelete(groupId);
		res.status(200).json({
			success: true,
			message: "Screen group deleted",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	getAllScreenGroupsForUser,
	getAllUngroupedScreensForUser,
	createAScreenGroupForUser,
	editAScreenGroupForUser,
	deleteAScreenGroupForUser,
};
