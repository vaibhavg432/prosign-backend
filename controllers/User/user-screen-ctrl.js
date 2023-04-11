const User = require("../../models/User");
const Screen = require("../../models/Screen");
const ScreenGroup = require("../../models/ScreenGroup");

const getAllScreens = async (req, res) => {
	const { id } = req.user;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const screens = await Screen.find({ userId: id });
		if (!screens) {
			res.status(400).json({
				success: false,
				message: "Screens not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Screens found",
			screens: screens,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const currentPlayingScreens = async (req, res) => {
	const { id } = req.user;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const screens = await Screen.find({ userId: id });
		if (!screens) {
			res.status(400).json({
				success: false,
				message: "Screens not found",
			});
		}

		const playingScreens = screens.filter((screen) => screen.isPlaying);
		res.status(200).json({
			success: true,
			message: "Screens found",
			screens: playingScreens,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const addOneScreenUser = async (req, res) => {
	const { id } = req.user;

	try {
		const user = await User.findById(id);
		if (!user) {
			res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const remainingScreens = user.screenLimit - user.screens.length;
		if (remainingScreens <= 0) {
			res.status(400).json({
				success: false,
				message: "Screen limit reached",
			});
		}

		const username =
			"screen" +
			user.screenCount +
			1 +
			user.name +
			crypto.randomBytes(4).toString("hex");
		const password = crypto.randomBytes(8).toString("hex");

		const screen = new Screen({
			userId: id,
			username: username,
			password: password,
		});

		const savedScreen = await screen.save();
		user.screens.push(savedScreen._id);
		user.screenCount += 1;
		await user.save();
		res.status(200).json({
			success: true,
			message: "Screen added",
			screen: savedScreen,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const addMultipleScreensUser = async (req, res) => {
	const { id } = req.user;
	const { count } = req.body;

	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const remainingScreens = user.screenLimit - user.screens.length;
		if (remainingScreens - count < 0) {
			return res.status(400).json({
				success: false,
				message: "Screen limit reached",
			});
		}

		const screens = [];
		for (let i = 0; i < count; i++) {
			const username =
				"screen" +
				user.screenCount +
				1 +
				user.name.split(" ")[0] +
				require("crypto").randomBytes(4).toString("hex");
			const password = require("crypto").randomBytes(8).toString("hex");

			const screen = new Screen({
				userId: id,
				username: username,
				password: password,
			});

			const savedScreen = await screen.save();
			user.screens.push(savedScreen._id);
			user.screenCount += 1;
			screens.push(savedScreen);
		}

		await user.save();
		res.status(200).json({
			success: true,
			message: "Screens added",
			screens: screens,
		});
	} catch (err) {
		res.status(500).json(err.message);
	}
};

const updateScreenName = async (req, res) => {
	const { id } = req.user;
	const { screenId } = req.params;
	const { name } = req.body;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const screen = await Screen.findById(screenId);
		if (!screen) {
			return res.status(400).json({
				success: false,
				message: "Screen not found",
			});
		}

		if (!name) {
			return res.status(200).json({
				success: false,
				message: "Name not provided",
			});
		}

		screen.name = name;
		await Screen.findByIdAndUpdate(screenId, screen);
		res.status(200).json({
			success: true,
			message: "Screen Name updated",
			screen: screen,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const playDocumentOnAllScreens = async (req, res) => {
	const { id } = req.user;
	const { documentId } = req.body;
	try {
		const user = await User.findById(id);
		if (!user) {
			res.status(400).json({
				success: false,
				message: "User not found",
			});
		}
		const screens = await Screen.find({ userId: id });
		if (!screens) {
			res.status(400).json({
				success: false,
				message: "Screens not found",
			});
		}

		for (let i = 0; i < screens.length; i++) {
			const screen = screens[i];
			screen.document = documentId;
			screen.isPlaying = true;
			screen.isUpdated = 1 - screen.isUpdated;
			screen.lastUpdated = Date.now();
			await screen.save();
		}

		res.status(200).json({
			success: true,
			message: "Document played on all screens",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const playDocumentOnOneScreen = async (req, res) => {
	const { id } = req.user;
	const { documentId, screenId } = req.body;
	try {
		const user = await User.findById(id);
		if (!user) {
			res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const screen = await Screen.findById(screenId);
		if (!screen) {
			res.status(400).json({
				success: false,
				message: "Screen not found",
			});
		}

		screen.document = documentId;
		screen.isPlaying = true;
		screen.isUpdated = 1 - screen.isUpdated;
		await screen.save();

		res.status(200).json({
			success: true,
			message: "Document played on screen",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const playPlaylistOnMixedScreens = async (req, res) => {
	const { id } = req.user;
	const { group, alone, playlist } = req.body;
	try {
		if (group.length === 0 && alone.length === 0) {
			return res.status(200).json({
				success: false,
				message: "No screens selected",
			});
		}

		if (playlist === "") {
			return res.status(200).json({
				success: false,
				message: "No playlist selected",
			});
		}

		for (let i = 0; i < group.length; i++) {
			const screenGroup = await ScreenGroup.findOne({ _id: group[i] });
			for (let j = 0; j < screenGroup.screens.length; j++) {
				const screen = await Screen.findById(screenGroup.screens[j]);
				screen.document = playlist;
				screen.isPlaying = true;
				screen.isUpdated = 1 - screen.isUpdated;
				screen.lastUpdated = Date.now();
				await screen.save();
			}
			screenGroup.document = playlist;
			screenGroup.isPlaying = true;
			await screenGroup.save();
		}

		for (let i = 0; i < alone.length; i++) {
			const screen = await Screen.findById(alone[i]);
			screen.document = playlist;
			screen.isPlaying = true;
			screen.isUpdated = 1 - screen.isUpdated;
			screen.lastUpdated = Date.now();
			await screen.save();
		}

		res.status(200).json({
			success: true,
			message: "Playlist played on screens",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const stopDocumentOnAllScreens = async (req, res) => {
	const { id } = req.user;
	try {
		const user = await User.findById(id);
		if (!user) {
			res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const screens = await Screen.find({ userId: id });
		if (!screens) {
			res.status(400).json({
				success: false,
				message: "Screens not found",
			});
		}

		for (let i = 0; i < screens.length; i++) {
			const screen = screens[i];
			screen.isPlaying = false;
			screen.isUpdated = 1 - screen.isUpdated;
			await screen.save();
		}

		res.status(200).json({
			success: true,
			message: "Document stopped on all screens",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const stopDocumentOnOneScreen = async (req, res) => {
	const { id } = req.user;
	const { screenId } = req.body;
	try {
		const user = await User.findById(id);
		if (!user) {
			res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const screen = await Screen.findById(screenId);
		if (!screen) {
			res.status(400).json({
				success: false,
				message: "Screen not found",
			});
		}

		screen.isPlaying = false;
		screen.isUpdated = 1 - screen.isUpdated;
		await screen.save();

		res.status(200).json({
			success: true,
			message: "Document stopped on screen",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const stopPlaylistOnOneScreen = async (req, res) => {
	const { id } = req.user;
	const { screenId } = req.params;
	try {
		const screen = await Screen.findById(screenId);
		if (!screen) {
			res.status(400).json({
				success: false,
				message: "Screen not found",
			});
		}

		screen.isPlaying = false;
		screen.isUpdated = 1 - screen.isUpdated;
		await Screen.findByIdAndUpdate(screenId, screen);

		res.status(200).json({
			success: true,
			message: "Playlist stopped on screen",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const stopPlaylistOnOneGroup = async (req, res) => {
	const { id } = req.user;
	const { groupId } = req.params;
	try {
		const group = await ScreenGroup.findById(groupId);
		if (!group) {
			return res.status(400).json({
				success: false,
				message: "Group not found",
			});
		}

		for (let i = 0; i < group.screens.length; i++) {
			const screen = await Screen.findById(group.screens[i]);
			screen.isPlaying = false;
			screen.isUpdated = 1 - screen.isUpdated;
			await screen.save();
		}
		group.isPlaying = false;
		await group.save();

		res.status(200).json({
			success: true,
			message: "Playlist stopped on group",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const playlistOnCurrentScreen = async (req, res) => {
	const { id } = req.user;
	try {
		const screen = await Screen.findById(id);
		if (!screen) {
			return res.status(400).json({
				success: false,
				message: "Screen not found",
			});
		}

		if (!screen.isPlaying) {
			return res.status(200).json({
				success: false,
				message: "Screen is not playing",
			});
		}

		const { document } = screen.document;
		const playlist = await Playlist.findById(document);
		if (!playlist) {
			return res.status(200).json({
				success: false,
				message: "Playlist not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Playlist found",
			documents: playlist.documents,
		});
	} catch (err) {
		res.status.json(err);
	}
};

const logoutScreen = async (req, res) => {
	const { id } = req.user;
	const { screenId } = req.params;
	try {
		const screen = await Screen.findById(screenId);
		if (!screen) {
			return res.status(400).json({
				success: false,
				message: "Screen not found",
			});
		}

		screen.status = "inactive";
		await Screen.findByIdAndUpdate(screenId, screen);

		res.status(200).json({
			success: true,
			message: "Screen logged out",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	getAllScreens,
	currentPlayingScreens,
	addOneScreenUser,
	addMultipleScreensUser,
	updateScreenName,
	playDocumentOnAllScreens,
	playDocumentOnOneScreen,
	playPlaylistOnMixedScreens,
	stopDocumentOnAllScreens,
	stopDocumentOnOneScreen,
	stopPlaylistOnOneScreen,
	stopPlaylistOnOneGroup,
	logoutScreen,
};
