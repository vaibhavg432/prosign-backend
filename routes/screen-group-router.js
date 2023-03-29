const express = require("express");
const router = express.Router();

const {
	getAllScreenGroupsForUser,
	createAScreenGroupForUser,
	editAScreenGroupForUser,
	deleteAScreenGroupForUser,
} = require("../controllers/screenGroup-ctrl");

const { userLogin } = require("../middleware/auth");

router.get("/screen-groups", userLogin, getAllScreenGroupsForUser);
router.post("/create-screen-group", userLogin, createAScreenGroupForUser);
router.patch("/edit-screen-group/:groupId", userLogin, editAScreenGroupForUser);
router.delete(
	"/delete-screen-group/:groupId",
	userLogin,
	deleteAScreenGroupForUser,
);

module.exports = router;
