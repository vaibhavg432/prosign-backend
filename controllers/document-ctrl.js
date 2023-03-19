const Document = require("../models/Document");
const User = require("../models/User");
//All Documents Attached to User
const getAllDocuments = async (req, res) => {
	const { id } = req.user;
	if (!id) {
		res.status(400).json({
			success: false,
			message: "Invalid ID",
		});
	}

	try {
		const user = await User.findById(id);
		if (!user) {
			res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const documents = await Document.find({ _id: id });
		res.status(200).json({
			success: true,
			message: "Documents found",
			documents: documents,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const uploadDocument = async (req, res) => {
	const { id } = req.user;
	const { link } = req.body;
	if (!id) {
		res.status(400).json({
			success: false,
			message: "Invalid ID",
		});
	}

	try {
		const document = new Document({
			userId: id,
			link: link,
		});

		const savedDocument = await document.save();
		res.status(200).json({
			success: true,
			message: "Document uploaded",
			document: savedDocument,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	getAllDocuments,
	uploadDocument,
};
