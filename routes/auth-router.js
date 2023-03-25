const express = require("express");
const router = express.Router();

const {
	register,
	login,
	resetPassword,
	forgotPassword,
} = require("../controllers/auth-ctrl");

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

module.exports = router;
