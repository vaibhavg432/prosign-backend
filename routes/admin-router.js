const express = require("express");
const router = express.Router();

const {
	getAllAdmins,
	getAllUsers,
	removeUser,
	updateScreenCountforUser,
	viewScreensOfOneUser,
} = require("../controllers/admin-ctrl");
const { adminLogin } = require("../middleware/auth");

router.get("/users", adminLogin, getAllUsers);
router.get("/admins", adminLogin, getAllAdmins);
router.get("/view-screens/:id", adminLogin, viewScreensOfOneUser);
router.patch("/update-screen-count", adminLogin, updateScreenCountforUser);
router.delete("/remove-user/:id", adminLogin, removeUser);

module.exports = router;
