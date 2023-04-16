const AWS = require("aws-sdk");

const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3FileUpload = (image) => {
	AWS.config.update({
		accessKeyId: AWS_ACCESS_KEY,
		secretAccessKey: AWS_SECRET_ACCESS_KEY,
		region: AWS_REGION,
	});

	const s3 = new AWS.S3();
	const fileContent = Buffer.from(image.files.data.data, "binary");
	const params = {
		Bucket: AWS_BUCKET_NAME,
		Key: image.files.data.name,
		Body: fileContent,
		contentDisposition: "inline",
	};

	console.log("Uploading file to S3 bucket", params);

	s3.upload(params, function (err, data) {
		if (err) {
			console.log("Error", err);
		}
		if (data) {
			return data.Location;
		}
	});
};

module.exports = s3FileUpload;
