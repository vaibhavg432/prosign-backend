const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config("./.env");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({
		status: "success",
		message: "Hello World",
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
