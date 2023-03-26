const express = require("express");
const router = express.Router();

const {
	login,
	logout,
	checkCurrentStatus,
	getOneDocument,
} = require("../controllers/mobileUser-ctrl");

const { userLogin } = require("../middleware/auth");

router.get("/check-current-status", userLogin, checkCurrentStatus);
router.post("/login", login);
router.post("/logout", userLogin, logout);
router.get("/document/:documentId", userLogin, getOneDocument);

module.exports = router;
