const express = require("express");
const router = express.Router();

const {
	getAllScreens,
	getAllDocuments,
	addOneScreenUser,
	addMultipleScreensUser,
	uploadOneDocument,
	uploadMultipleDocument,
	playDocumentOnAllScreens,
	stopDocumentOnAllScreens,
	playDocumentOnOneScreen,
	stopDocumentOnOneScreen,
} = require("../controllers/user-ctrl");

const { userLogin } = require("../middleware/auth");

router.get("/screens", userLogin, getAllScreens);
router.get("/documents", userLogin, getAllDocuments);
router.post("/add-screen", userLogin, addOneScreenUser);
router.post("/add-multiple-screens", userLogin, addMultipleScreensUser);
router.post("/upload-document", userLogin, uploadOneDocument);
router.post("/upload-multiple-documents", userLogin, uploadMultipleDocument);
router.post("/play-document-all-screens", userLogin, playDocumentOnAllScreens);
router.post("/play-document-one-screen", userLogin, playDocumentOnOneScreen);
router.post("/stop-document-all-screens", userLogin, stopDocumentOnAllScreens);
router.post("/stop-document-one-screen", userLogin, stopDocumentOnOneScreen);

module.exports = router;
