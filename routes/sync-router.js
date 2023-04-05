const express = require("express");
const router = express.Router();
const Screen = require("../models/Screen");

router.patch("/", async (req, res) => {
	const screens = await Screen.find();
	for (let i = 0; i < screens.length; i++) {
		const screen = screens[i];
		screen.name = "Screen " + (i + 1);
		await screen.save();
	}
	res.status(200).json({
		status: "success",
		screens,
	}); 
});

module.exports = router;
