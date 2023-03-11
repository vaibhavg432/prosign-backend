const mongoose = require("mongoose");
require("dotenv").config();
const URI = process.env.MONGO_URI;

const connnect = (async) => {
	mongoose
		.connect(URI)
		.then(() => {
			console.log("Database connected");
		})
		.catch((err) => {
			console.log("Database connection failed");
		});
};

module.exports = connnect;
