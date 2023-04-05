const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");
const fileUpload = require("express-fileupload");
dotenv.config("./.env");

const authRouter = require("./routes/auth-router");
const adminRouter = require("./routes/admin-router");
const userRouter = require("./routes/user-router");
const mobileUserRouter = require("./routes/mobileUser-router");
const screenGroupRouter = require("./routes/screen-group-router");
const playlistRouter = require("./routes/playlist-router");
const syncRouter = require("./routes/sync-router");

const app = express();
db();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.get("/", (req, res) => {
	res.status(200).json({
		status: "success",
		message: "Hello World",
	});
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/mobileUser", mobileUserRouter);
app.use("/api/screen-group", screenGroupRouter);
app.use("/api/playlist", playlistRouter);
app.use("/api/sync", syncRouter);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
