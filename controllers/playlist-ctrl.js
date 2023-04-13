const Playlist = require("../models/Playlist");
const ScreenGroup = require("../models/ScreenGroup");
const Screen = require("../models/Screen");
const User = require("../models/User");

const getAllPlaylistForUser = async (req, res) => {
	const { id } = req.user;
	try {
		const playlist = await Playlist.find({ userId: id });
		res.status(200).json({
			success: true,
			message: "Playlist found",
			playlist: playlist,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const getOnePlaylistForUser = async (req, res) => {
	const { playlistId } = req.params;
	try {
		const playlist = await Playlist.findOne({ _id: playlistId });
		if (!playlist) {
			return res.status(400).json({
				success: false,
				message: "Playlist not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Playlist found",
			playlist: playlist,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};
const createPlaylistForUser = async (req, res) => {
	const { id } = req.user;
	const { name, documents } = req.body;
	try {
		if (!name || !documents) {
			return res.status(200).json({
				success: false,
				message: "Playlist name and documents are required",
			});
		}

		if (documents.length === 0) {
			return res.status(200).json({
				success: false,
				message: "Playlist must have at least one document",
			});
		}
		const playlistCheck = await Playlist.findOne({
			name: name,
			userId: id,
		});

		if (playlistCheck) {
			return res.status(200).json({
				success: false,
				message: `Playlist with name ${name} already exists`,
			});
		}

		const playlist = await Playlist.create({
			name: name,
			userId: id,
			documents: documents,
		});
		res.status(200).json({
			success: true,
			message: "Playlist created",
			playlist: playlist,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const editPlaylistForUser = async (req, res) => {
	const { id } = req.user;
	const { playlistId } = req.params;
	const { name, documents } = req.body;
	try {
		console.log(playlistId);
		const playlist = await Playlist.findById(playlistId);
		if (!playlist) {
			return res.status(400).json({
				success: false,
				message: "Playlist not found",
			});
		}
		console.log("name", name);
		console.log("documents", documents);
		const playlistCheck = await Playlist.findOne({
			name: name,
			userId: id,
		});
		if (playlistCheck && playlistCheck._id != playlistId) {
			return res.status(200).json({
				success: false,
				message: `Playlist with name ${name} already exists`,
			});
		}
		playlist.name = name;
		playlist.documents = documents;

		await Playlist.findByIdAndUpdate(playlistId, playlist);

		res.status(200).json({
			success: true,
			message: "Playlist updated",
			playlist: playlist,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const deletePlaylistForUser = async (req, res) => {
	const { playlistId } = req.params;
	try {
		const playlist = await Playlist.findById(playlistId);
		if (!playlist) {
			return res.status(400).json({
				success: false,
				message: "Playlist not found",
			});
		}

		await Playlist.findByIdAndDelete(playlistId);
		res.status(200).json({
			success: true,
			message: "Playlist deleted",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	getAllPlaylistForUser,
	getOnePlaylistForUser,
	createPlaylistForUser,
	editPlaylistForUser,
	deletePlaylistForUser,
};
