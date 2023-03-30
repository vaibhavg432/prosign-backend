const express = require("express");
const router = express.Router();

const {
	getAllPlaylistForUser,
	getOnePlaylistForUser,
	createPlaylistForUser,
	editPlaylistForUser,
	deletePlaylistForUser,
} = require("../controllers/playlist-ctrl");

const { userLogin } = require("../middleware/auth");

router.get("/", userLogin, getAllPlaylistForUser);
router.get("/:playlistId", userLogin, getOnePlaylistForUser);
router.post("/", userLogin, createPlaylistForUser);
router.patch("/:playlistId", userLogin, editPlaylistForUser);
router.delete("/:playlistId", userLogin, deletePlaylistForUser);


module.exports = router;