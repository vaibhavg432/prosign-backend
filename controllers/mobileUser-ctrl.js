const User = require("../models/User");
const Screen = require("../models/Screen");
const Document = require("../models/Document");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
	const { username, password } = req.body;
	try {
		const screen = await Screen.findOne({ username: username });
		if (!screen) {
			return res.status(400).json({
				success: false,
				message: "Screen not found",
			});
		}

		if (screen.status === "active") {
			return res.status(400).json({
				success: false,
				message: "Screen is already logged in",
			});
		}

		if (password != screen.password) {
			return res.status(400).json({
				success: false,
				message: "Wrong password",
			});
		}

		const token = jwt.sign({ id: screen._id, role: "user" }, JWT_SECRET, {
			expiresIn: "100h",
		});
		screen.status = "active";
		await screen.save();
		res.status(200).json({
			success: true,
			message: "Login successful",
			token: token,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const logout = async (req, res) => {
	const { id } = req.user;
	try {
		const screen = await Screen.findById(id);
		if (!screen) {
			return res.status(400).json({
				success: false,
				message: "Screen not found",
			});
		}

		screen.status = "inactive";
		await screen.save();
		res.status(200).json({
			success: true,
			message: "Logout successful",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const checkCurrentStatus = async (req, res) => {
	const { id } = req.user;
	try {
		const screen = await Screen.findById(id);
		if (!screen) {
			return res.status(400).json({
				success: false,
				message: "Screen not found",
			});
		}
		if (screen.isPlaying) {
			return res.status(200).json({
				success: true,
				playing: true,
				message: "Screen is playing",
				document: screen.document,
			});
		}

		res.status(200).json({
			success: true,
			playing: false,
			message: "Screen is not playing",
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
module.exports = {
	login,
	logout,
	checkCurrentStatus,
	getOneDocument,
};
