const express = require("express");
const router = express.Router();

const {
	getAllAdmins,
	getAllUsers,
	totalNumberOfScreens,
	currentPlayingScreens,
	removeUser,
	toggleStatusOfUser,
	updateScreenLimitforUser,
	viewScreensOfOneUser,
} = require("../controllers/admin-ctrl");
const { adminLogin } = require("../middleware/auth");

router.get("/users", adminLogin, getAllUsers);
router.get("/admins", adminLogin, getAllAdmins);
router.get("/total-screens", adminLogin, totalNumberOfScreens);
router.get("/current-playing-screens", adminLogin, currentPlayingScreens);
router.get("/view-screens/:id", adminLogin, viewScreensOfOneUser);
router.patch("/toggle-status/:id", adminLogin, toggleStatusOfUser);
router.patch("/update-screen-limit/:userId", adminLogin, updateScreenLimitforUser);
router.delete("/remove-user/:id", adminLogin, removeUser);

module.exports = router;
