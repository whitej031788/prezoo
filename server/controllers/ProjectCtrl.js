'use strict';

const multer = require('multer');
const model = require('../models');
const PDFImage = require('pdf-image').PDFImage;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage }).single('file');

const ProjectController = () => {

  const projectUpload = (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
          return res.status(500).json(err);
      } else if (err) {
          return res.status(500).json(err);
      }
      console.log(req.file.path);
      var pdfImage = new PDFImage(req.file.path);
      console.log(pdfImage);
      pdfImage.convertFile(0).then(function (imagePaths) {
        console.log(imagePaths);
        return res.status(200).send(req.file);
      });  
    })
  };

  return {
    projectUpload
  };
};

module.exports = ProjectController;