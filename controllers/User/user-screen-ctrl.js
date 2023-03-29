const User = require("../../models/User");
const Screen = require("../../models/Screen");
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
			screens.push(savedScreen);
		}

		await user.save();
		res.status(200).json({
			success: true,
			message: "Screens added",
			screens: screens,
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

module.exports = {
	getAllScreens,
	currentPlayingScreens,
	addOneScreenUser,
	addMultipleScreensUser,
	playDocumentOnAllScreens,
	playDocumentOnOneScreen,
	stopDocumentOnAllScreens,
	stopDocumentOnOneScreen,
};