const User = require("../../models/User");

const getUser = async (req, res) => {
	const { id } = req.user;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "User found",
			user: user,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const editUserProfile = async (req, res) => {
	const { id } = req.user;
	const { name, email, phone, address, bio } = req.body;
	try {
		const user = await User.findById(id);
		if (!user) {
			res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		user.name = name;
		user.email = email;
		user.phone = phone;
		user.address = address;
		user.bio = bio;

		await user.save();

		res.status(200).json({
			success: true,
			message: "User profile updated",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	getUser,
	editUserProfile,
};
