const express = require("express");
const router = express.Router();

const {
	register,
	login,
	resetPassword,
	forgotPassword,
	changePassword
} = require("../controllers/auth-ctrl");

const { superLogin } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", superLogin, resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", changePassword);

module.exports = router;
