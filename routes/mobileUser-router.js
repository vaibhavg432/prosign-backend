const express = require("express");
const router = express.Router();

const {
	login,
	logout,
	checkCurrentStatus,
} = require("../controllers/mobileUser-ctrl");

const { userLogin } = require("../middleware/auth");

router.get("/check-current-status", userLogin, checkCurrentStatus);
router.post("/login", login);
router.post("/logout", userLogin, logout);

module.exports = router;
