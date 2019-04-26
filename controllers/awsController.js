const router = require('express').Router();
const Image = require('./db').import('./models/image');
const multer = require('multer');
const multerS3 = require('multer-s3');
const fs = require('fs');
const AWS = require('aws-sdk');




module.exports = router;