const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/nodeMailer");

const JWT_SECRET = process.env.JWT_SECRET;

//Register a new user
const register = async (req, res) => {
	try {
		const { name, email, password, confirmPassword } = req.body;
		let { role } = req.body;

		//validation
		if (!name || !email || !password || !confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Please enter all fields",
			});
		}

		if (password.length < 6) {
			return res.status(400).json({
				success: false,
				message: "Password must be at least 6 characters long",
			});
		}

		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Passwords do not match",
			});
		}

		const user = await User.find({ email });
		if (user.length > 0) {
			return res.status(400).json({
				success: false,
				message: "User already exists",
			});
		}

		if (!role) {
			role = "user";
		}

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const newUser = new User({
			name,
			email,
			password: hash,
			role,
		});

		const savedUser = await newUser.save();
		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: savedUser,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

//Login a user
const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		//validation
		if (!email || !password) {
			return res.status(200).json({
				success: false,
				message: "Please Enter all Fields",
			});
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(200).json({
				success: false,
				message: "User does not exist",
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(200).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
			expiresIn: 2592000,
		});

		res.status(200).json({
			success: true,
			message: "User logged in successfully",
			token,
			role: user.role,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

//Reset Password
const resetPassword = async (req, res) => {
	const { id } = req.user;
	if (!id)
		return res
			.status(400)
			.json({ success: false, message: "Invalid request" });
	try {
		const { currentPassword, password, confirmPassword } = req.body;
		const user = await User.findById(id);

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User does not exist",
			});
		}

		const isMatch = await bcrypt.compare(currentPassword, user.password);
		if (!isMatch) {
			return res.status(400).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		//validation
		if (!password || !confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Please enter all fields",
			});
		}

		if (password.length < 6) {
			return res.status(400).json({
				success: false,
				message: "Password must be at least 6 characters long",
			});
		}

		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Passwords do not match",
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		user.password = hash;
		const savedUser = await user.save();
		res.status(201).json({
			success: true,
			message: "Password reset successfully",
			user: savedUser,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		//validation
		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Please enter all fields",
			});
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User does not exist",
			});
		}

		const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
			expiresIn: 3600,
		});

		const url = `http://localhost:3000/reset-password/${token}`;

		const mailOptions = {
			from: "guptavaibhav432@gmail.com",
			to: email,
			subject: "Reset Password",
			html: `<h1>Reset Password</h1>
			<p>Click on the link below to reset your password</p>
			<a href=${url}>${url}</a>`,
		};

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					success: false,
					message: "Something went wrong",
				});
			}
			console.log("Email sent: " + info.response);
			res.status(200).json({
				success: true,
				message: "Email sent successfully",
			});
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = {
	register,
	login,
	resetPassword,
	forgotPassword,
};
