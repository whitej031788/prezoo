'use strict';

const multer = require('multer');
const model = require('../models');
const PDFImage = require('pdf-image').PDFImage;
const env = process.env.NODE_ENV;
const storageConfig = require(__dirname + '/../config/storage.json')[env];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storageConfig.publicStoragePath)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage }).single('file');

const ProjectController = () => {
  const projectUpload = async (req, res, next) => {
    console.log('Starting upload');
    try {
      upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }

        console.log('Upload complete');

        // The PDF uploaded fine, let's create the individual PNG slides
        var pdfImage = new PDFImage(req.file.path);
        pdfImage.convertFile().then(async function (imagePaths) {
          console.log('Images converted');
          // If we got here, we have created the PDF file on disk and created a PNG file
          // for every page of the PDF. Now let's create our models and save to DB before sending success
          const project = await model.Project.create({
            originalFileName: req.file.originalname,
            uploadedFileName: req.file.filename,
            filePath: req.file.path,
            collabCode: generateCollabCode(8)
          });

          console.log('Created project');

          imagePaths.forEach(async function (value, i) {
            // The pdfImage library returns the full disk path of the new slides
            // As the public_path column is meant for the frontend to serve the image
            // remove the local disk part and store file name
            let filePath = value.replace(storageConfig.publicStoragePath, '');
            await model.Slide.create({
              projectId: project.id,
              order: i + 1,
              filePath: value,
              fileName: filePath,
              notes: ''
            });
          });

          let retObj = {
            success: true,
            projectId: project.id,
            collabCode: project.collabCode,
            projectGuid: project.projectGuid
          }

          return res.status(200).send(retObj);
        }).catch(err => {
          console.log(err);
          return res.status(500).json(err);
        });  
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    };
  };

  const getProjectAndSlides = async (req, res, next) => {
    try {
      const project = await model.Project.findOne({
        where: {
          projectGuid: req.params.projectGuid,
        },
        include: { model: model.Slide }
      });
      return res.status(200).send(project);
    } catch (error) {
      console.log(err);
      return res.status(500).json(err);
    }
  }

  const updateProject = async (req, res, next) => {
    try {
      const project = await model.Project.findOne({ where: { id: parseInt(req.params.projectId) }});

      if (project) {
        await project.update(req.body);
        return res.status(200).send(project);
      } else {
        return res.status(500).send("Cannot find project");
      }
    } catch (error) {
      console.log(err);
      return res.status(500).json(err);
    }
  }

  function generateCollabCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  return {
    projectUpload,
    getProjectAndSlides,
    updateProject
  };
};

module.exports = ProjectController;