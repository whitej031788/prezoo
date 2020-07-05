'use strict';

const multer = require('multer');
const model = require('../models');
const db = require('../models');
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

  const projectUpload = async (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
          return res.status(500).json(err);
      } else if (err) {
          return res.status(500).json(err);
      }

      // The PDF uploaded fine, let's create the individual PNG slides
      var pdfImage = new PDFImage(req.file.path);
      pdfImage.convertFile().then(async function (imagePaths) {
        try {
          // If we got here, we have created the PDF file on disk and created a PNG file
          // for every page of the PDF. Now let's create our models and save to DB before sending success
          console.log(model.Project);
          const project = await model.Project.create({
            original_file_name: req.file.originalname,
            uploaded_file_name: req.file.filename,
            file_path: req.file.path,
            collab_code: generateCollabCode(8)
          });

          imagePaths.forEach(async function (value, i) {
            await model.Slide.create({
              project_id: project.id,
              order: i + 1,
              file_path: value
            });
          });

          let retObj = {
            success: true,
            projectId: project.id,
            collabCode: project.collab_code,
            projectGuid: project.project_guid
          }

          return res.status(200).send(retObj);
        } catch (err) {
          console.log(err);
          return res.status(500).json(err);
        };  
      }).catch(err => {
        console.log(err);
        return res.status(500).json(err);
      });  
    })
  };

  const getProjectAndSlides = async (req, res, next) => {
    const project = await model.Project.findOne({
      where: {
        project_guid: req.params.projectGuid,
      },
      include: { model: db.Slide }
    });
    return res.status(200).send(project);
  }

  const generateCollabCode = (length) => {
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
    getProjectAndSlides
  };
};

module.exports = ProjectController;