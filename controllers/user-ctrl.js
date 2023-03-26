const User = require("../models/User");
const Screen = require("../models/Screen");
const Document = require("../models/Document");
const crypto = require("crypto");

const getUser = async (req, res) => {
	const { id } = req.user;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "User found",
			user: user,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

//All Screens Attached to User
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

const getOneDocument = async (req, res) => {
	const { id } = req.user;
	const { documentId } = req.params;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const document = await Document.findById(documentId);
		if (!document) {
			res.status(400).json({
				success: false,
				message: "Document not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Document found",
			document: document,
		});
	} catch (error) {
		res.status(500).json(err);
	}
};

const getAllDocuments = async (req, res) => {
	const { id } = req.user;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const documents = await Document.find({ userId: id });
		if (!documents) {
			res.status(400).json({
				success: false,
				message: "Documents not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Documents found",
			documents: documents,
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

const uploadOneDocument = async (req, res) => {
	const { id } = req.user;
	const { link } = req.body;
	try {
		const document = new Document({
			userId: id,
			link: link,
		});

		const savedDocument = await document.save();
		res.status(200).json({
			success: true,
			message: "Document uploaded",
			document: savedDocument,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const updateDocumentName = async (req, res) => {
	const { id } = req.user;
	const { documentId, name } = req.body;
	try {
		const user = await User.findById(id);
		console.log(req.body);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const document = await Document.findById(documentId);
		if (!document) {
			return res.status(400).json({
				success: false,
				message: "Document not found",
			});
		}

		if (document.userId != id) {
			return res.status(400).json({
				success: false,
				message: "Unauthorized",
			});
		}

		if (!name) {
			return res.state(200).json({
				success: false,
				message: "Name Cannot be empty",
			});
		}

		document.name = name;
		const savedDocument = await document.save();
		res.status(200).json({
			success: true,
			message: "Document name updated",
			document: savedDocument,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const uploadMultipleDocument = async (req, res) => {
	const { id } = req.user;
	const { links } = req.body;
	try {
		const user = await User.findById(id);
		if (!user) {
			res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		for (let i = 0; i < links.length; i++) {
			const document = new Document({
				userId: id,
				link: links[i],
			});

			const savedDocument = await document.save();
		}

		res.status(200).json({
			success: true,
			message: "Documents uploaded",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const deleteOneDocument = async (req, res) => {
	const { id } = req.user;
	const { documentId } = req.body;
	try {
		const document = await Document.findById(documentId);
		const screens = await Screen.find({
			document: documentId,
			isPlaying: true,
		});

		if (screens.length > 0) {
			return res.status(200).json({
				success: false,
				message: "Document is being played on some screens",
			});
		}

		if (document.userId != id) {
			return res.status(200).json({
				success: false,
				message: "Document does not belong to user",
			});
		}

		await Document.findByIdAndDelete(documentId);
		res.status(200).json({
			success: true,
			message: "Document deleted",
		});
	} catch (error) {
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

const editUserProfile = async (req, res) => {
	const { id } = req.user;
	const { name, email, phone, address, bio } = req.body;
	try {
		const user = await User.findById(id);
		if (!user) {
			res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		user.name = name;
		user.email = email;
		user.phone = phone;
		user.address = address;
		user.bio = bio;

		await user.save();

		res.status(200).json({
			success: true,
			message: "User profile updated",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	getUser,
	getAllScreens,
	getOneDocument,
	getAllDocuments,
	currentPlayingScreens,
	addOneScreenUser,
	uploadOneDocument,
	uploadMultipleDocument,
	updateDocumentName,
	deleteOneDocument,
	addMultipleScreensUser,
	playDocumentOnAllScreens,
	playDocumentOnOneScreen,
	stopDocumentOnAllScreens,
	stopDocumentOnOneScreen,
	editUserProfile,
};
