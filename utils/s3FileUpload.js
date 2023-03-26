const AWS = require("aws-sdk");

const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const region = process.env.AWS_REGION;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
	AWS_SDK_LOAD_CONFIG: 1,
	region,
	apiVersion: "latest",
	accessKeyId,
	secretAccessKey,
});

const uploadFile = () => {
	const params = {
		Bucket: bucketName,
		Key: `sdfsdfs.jpg`,
		Body: "This is the date",
	};
	// console.log(file)
	console.log("hi");
	s3.upload(params, (err, data) => {
		if (err) {
			throw err;
		}
		console.log(`File uploaded successfully. ${data.Location}`);
	});
};

module.exports = uploadFile;
