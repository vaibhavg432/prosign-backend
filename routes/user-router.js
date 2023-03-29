const express = require("express");
const router = express.Router();
const { getUser, editUserProfile } = require("../controllers/User/user-ctrl");

const {
	getOneDocument,
	getAllDocuments,
	uploadOneDocument,
	uploadMultipleDocument,
	updateDocumentName,
	deleteOneDocument,
} = require("../controllers/User/user-doc-ctrl");

const {
	getAllScreens,
	currentPlayingScreens,
	addOneScreenUser,
	addMultipleScreensUser,
	playDocumentOnAllScreens,
	stopDocumentOnAllScreens,
	playDocumentOnOneScreen,
	stopDocumentOnOneScreen,
} = require("../controllers/User/user-screen-ctrl");

const { userLogin } = require("../middleware/auth");

router.get("/user", userLogin, getUser);
router.get("/screens", userLogin, getAllScreens);
router.get("/document/:documentId", userLogin, getOneDocument);
router.get("/documents", userLogin, getAllDocuments);
router.get("/playing-screens", userLogin, currentPlayingScreens);
router.post("/add-screen", userLogin, addOneScreenUser);
router.post("/add-multiple-screens", userLogin, addMultipleScreensUser);
router.post("/upload-document", userLogin, uploadOneDocument);
router.post("/upload-multiple-documents", userLogin, uploadMultipleDocument);
router.post("/play-document-all-screens", userLogin, playDocumentOnAllScreens);
router.post("/play-document-one-screen", userLogin, playDocumentOnOneScreen);
router.post("/stop-document-all-screens", userLogin, stopDocumentOnAllScreens);
router.post("/stop-document-one-screen", userLogin, stopDocumentOnOneScreen);
router.patch("/update-document", userLogin, updateDocumentName);
router.patch("/edit-user-profile", userLogin, editUserProfile);
router.delete("/delete-document", userLogin, deleteOneDocument);

module.exports = router;
