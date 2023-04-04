const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const userLogin = async (req, res, next) => {
	let token = req.header("auth-token");
	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Access denied",
		});
	}
	token = token.replace("Bearer ", "");
	try {
		const verified = jwt.verify(token, JWT_SECRET);
		req.user = verified;
		if (req.user.role != "user") {
			return res.status(401).json({
				success: false,
				message: "Access denied",
			});
		}
		next();
	} catch (err) {
		res.status(400).json({
			message: err.message,
		});
	}
};

const adminLogin = async (req, res, next) => {
	let token = req.header("auth-token");
	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Access denied",
		});
	}
	token = token.replace("Bearer ", "");
	try {
		const verified = jwt.verify(token, JWT_SECRET);
		req.user = verified;
		if (req.user.role != "admin") {
			return res.status(401).json({
				success: false,
				message: "Access denied",
			});
		}
		next();
	} catch (err) {
		res.status(400).json({
			message: err.message,
		});
	}
};

module.exports = {
	userLogin,
	adminLogin,
};
