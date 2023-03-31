const express = require("express");
const router = express.Router();

const {
	getAllScreens,
	currentPlayingScreens,
	addOneScreenUser,
	addMultipleScreensUser,
	playDocumentOnAllScreens,
	stopDocumentOnAllScreens,
	playDocumentOnOneScreen,
	stopDocumentOnOneScreen,
	playPlaylistOnMixedScreens,
	stopPlaylistOnOneScreen,
	stopPlaylistOnOneGroup,
} = require("../controllers/User/user-screen-ctrl");

const {
	getAllScreenGroupsForUser,
	getAllUngroupedScreensForUser,
	createAScreenGroupForUser,
	editAScreenGroupForUser,
	deleteAScreenGroupForUser,
} = require("../controllers/screenGroup-ctrl");

const { userLogin } = require("../middleware/auth");
//user screens
router.get("/screens", userLogin, getAllScreens);
router.get("/playing-screens", userLogin, currentPlayingScreens);
router.post("/add-screen", userLogin, addOneScreenUser);
router.post("/add-multiple-screens", userLogin, addMultipleScreensUser);
router.post("/play-document-all-screens", userLogin, playDocumentOnAllScreens);
router.post("/play-document-one-screen", userLogin, playDocumentOnOneScreen);
router.post("/stop-document-all-screens", userLogin, stopDocumentOnAllScreens);
router.post("/stop-document-one-screen", userLogin, stopDocumentOnOneScreen);
router.post(
	"/play-playlist-mixed-screens",
	userLogin,
	playPlaylistOnMixedScreens,
);
router.post(
	"/stop-playlist-one-screen/:screenId",
	userLogin,
	stopPlaylistOnOneScreen,
);
router.post(
	"/stop-playlist-one-group/:groupId",
	userLogin,
	stopPlaylistOnOneGroup,
);

//user screen groups
router.get("/screen-groups", userLogin, getAllScreenGroupsForUser);
router.get("/ungrouped-screens", userLogin, getAllUngroupedScreensForUser);
router.post("/create-screen-group", userLogin, createAScreenGroupForUser);
router.patch("/edit-screen-group/:groupId", userLogin, editAScreenGroupForUser);
router.delete(
	"/delete-screen-group/:groupId",
	userLogin,
	deleteAScreenGroupForUser,
);

module.exports = router;
