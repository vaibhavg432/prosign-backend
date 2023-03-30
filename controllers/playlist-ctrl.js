const Playlist = require("../models/Playlist");
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
		const playlist = await Playlist.findById(playlistId);
		if (!playlist) {
			return res.status(400).json({
				success: false,
				message: "Playlist not found",
			});
		}

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

		await playlist.save();

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
	const { id } = req.user;
	const { playlistId } = req.params;
	try {
		const playlist = await Playlist.findById(playlistId);
		if (!playlist) {
			return res.status(400).json({
				success: false,
				message: "Playlist not found",
			});
		}

		await playlist.remove();
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
