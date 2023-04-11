const User = require("../../models/User");
const Screen = require("../../models/Screen");
const Document = require("../../models/Document");

const s3FileUpload = require("../../utils/s3FileUpload");

const getOneDocument = async (req, res) => {
	const { id } = req.user;
	const { documentId } = req.params;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const document = await Document.findById(documentId);
		if (!document) {
			res.status(400).json({
				success: false,
				message: "Document not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Document found",
			document: document,
		});
	} catch (error) {
		res.status(500).json(err);
	}
};

const getAllDocuments = async (req, res) => {
	const { id } = req.user;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const documents = await Document.find({ userId: id });
		if (!documents) {
			res.status(400).json({
				success: false,
				message: "Documents not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Documents found",
			documents: documents,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

//https://digi-board.s3.ap-south-1.amazonaws.com/Screenshot%20from%202023-03-24%2007-49-37.png
const uploadOneDocument = async (req, res) => {
	const { id } = req.user;
	try {
		console.log(req.body);
		const user = await User.findById(id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}
		// const type = req.files.data.mimetype.split("/")[0];
		// if ((type !== "image") | (type !== "video")) {
		// 	return res.status(200).json({
		// 		success: false,
		// 		message: "Only image and video files are allowed",
		// 	});
		// }
		s3FileUpload(req);
		const link =
			"https://digi-board.s3.ap-south-1.amazonaws.com/" +
			req.files.data.name.replace(/ /g, "%20");

		const document = new Document({
			userId: id,
			name: req.files.data.name,
			link: link,
			type: req.files.data.mimetype.split("/")[0],
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

const updateDocumentName = async (req, res) => {
	const { id } = req.user;
	const { documentId, name } = req.body;
	try {
		const user = await User.findById(id);
		console.log(req.body);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const document = await Document.findById(documentId);
		if (!document) {
			return res.status(400).json({
				success: false,
				message: "Document not found",
			});
		}

		if (document.userId != id) {
			return res.status(400).json({
				success: false,
				message: "Unauthorized",
			});
		}

		if (!name) {
			return res.state(200).json({
				success: false,
				message: "Name Cannot be empty",
			});
		}

		document.name = name;
		const savedDocument = await document.save();
		res.status(200).json({
			success: true,
			message: "Document name updated",
			document: savedDocument,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const uploadMultipleDocument = async (req, res) => {
	const { id } = req.user;
	const { links } = req.body;
	try {
		const user = await User.findById(id);
		if (!user) {
			res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		for (let i = 0; i < links.length; i++) {
			const document = new Document({
				userId: id,
				link: links[i],
			});

			const savedDocument = await document.save();
		}

		res.status(200).json({
			success: true,
			message: "Documents uploaded",
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const deleteOneDocument = async (req, res) => {
	const { id } = req.user;
	const { documentId } = req.body;
	try {
		const document = await Document.findById(documentId);
		const screens = await Screen.find({
			document: documentId,
			isPlaying: true,
		});

		if (screens.length > 0) {
			return res.status(200).json({
				success: false,
				message: "Document is being played on some screens",
			});
		}

		if (document.userId != id) {
			return res.status(200).json({
				success: false,
				message: "Document does not belong to user",
			});
		}

		await Document.findByIdAndDelete(documentId);
		res.status(200).json({
			success: true,
			message: "Document deleted",
		});
	} catch (error) {
		res.status(500).json(err);
	}
};

module.exports = {
	getOneDocument,
	getAllDocuments,
	uploadOneDocument,
	updateDocumentName,
	uploadMultipleDocument,
	deleteOneDocument,
};
