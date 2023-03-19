const express = require("express");
const router = express.Router();

const { login, checkCurrentStatus } = require("../controllers/mobileUser-ctrl");

const { userLogin } = require("../middleware/auth");

router.get("/check-current-status", userLogin, checkCurrentStatus);
router.post("/login", login);

module.exports = router;
