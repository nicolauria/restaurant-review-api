const aws = require('aws-sdk'),
    multer = require('multer'),
    multerS3 = require('multer-s3');

const accessKeyId = require('../config/keys').awsAccessKeyId;
const secretAccessKey = require('../config/keys').awsSecretAccessKey;

const s3 = new aws.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  Bucket: 'restaurant-review-pro'
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'restaurant-review-pro',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
});

module.exports = upload;
