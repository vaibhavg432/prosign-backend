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


const { userLogin } = require("../middleware/auth");

//user
router.get("/user", userLogin, getUser);

router.patch("/edit-user-profile", userLogin, editUserProfile);

//user-doc
router.get("/document/:documentId", userLogin, getOneDocument);
router.get("/documents", userLogin, getAllDocuments);
router.post("/upload-document", userLogin, uploadOneDocument);
router.post("/upload-multiple-documents", userLogin, uploadMultipleDocument);
router.patch("/update-document", userLogin, updateDocumentName);
router.delete("/delete-document", userLogin, deleteOneDocument);

module.exports = router;
