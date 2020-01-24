const express = require('express');
const router = express.Router();
const User = require('../models/User');

const { uploader } = require('../configs/cloudinary');

router.post('/', uploader.single("imageURL"), (req, res, next) => {
  // console.log('file is: ', req.file)
  console.log('public id: ', req.file.public_id);
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }

  res.json({ secure_url: req.file.secure_url, public_id: req.file.public_id });
})

module.exports = router;