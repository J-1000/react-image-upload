const express = require('express');
const router = express.Router();
const User = require('../models/User');

const uploader = require('../configs/cloudinary');

router.post('/', uploader.single("imageUrl"), (req, res, next) => {
  // console.log('file is: ', req.file)

  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  User.findOneAndUpdate({ username: req.user.username }, { imageURL: req.file.url })
    .then(() => {
      res.json({
        success: true,
        image: req.file.url
      })
    })
  res.json({ secure_url: req.file.secure_url });
})

module.exports = router;