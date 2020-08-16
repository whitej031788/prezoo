'use strict';

const multer = require('multer');
const model = require('../models');
const PDFImage = require('pdf-image').PDFImage;
const env = process.env.NODE_ENV;
const storageConfig = require(__dirname + '/../config/storage.json')[env];
const presentationCtrl = require('./PresentationCtrl');
// const Airtable = require('airtable');

// const base = new Airtable({
//   apiKey: process.env.AIRTABLE_API_KEY,
// }).base(process.env.AIRTABLE_BASE_ID);
// const table = base('Beta Users');

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

        // The PDF uploaded fine, let's create the individual PNG slides
        var pdfImage = new PDFImage(req.file.path);
        pdfImage.convertFile().then(async function (imagePaths) {
          // If we got here, we have created the PDF file on disk and created a PNG file
          // for every page of the PDF. Now let's create our models and save to DB before sending success
          const project = await model.Project.create();

          const projectAsset = await model.ProjectAsset.create({
            projectId: project.id,
            originalFileName: req.file.originalname,
            uploadedFileName: req.file.filename,
            filePath: req.file.path,
            type: 'pdf'
          });

          imagePaths.forEach(async function (value, i) {
            // The pdfImage library returns the full disk path of the new slides
            // As the public_path column is meant for the frontend to serve the image
            // remove the local disk part and store file name
            let filePath = value.replace(storageConfig.publicStoragePath, '');
            await model.Slide.create({
              projectId: project.id,
              projectAssetId: projectAsset.id,
              order: i + 1,
              filePath: value,
              fileName: filePath
            });
          });

          // As prezoo exists now, create a presentation right at the start
          // In future we may decouple creating projects from presentations, more a paid feature
          const presentation = await model.Presentation.create({
            projectId: project.id,
            collabCode: presentationCtrl().generateCollabCode(10)
          });

          let retObj = {
            success: true,
            projectId: project.id,
            presentationId: presentation.id,
            collabCode: presentation.collabCode,
            presentationGuid: presentation.presentationGuid
          }

          return res.status(200).send(retObj);
        }).catch(err => {
          console.log(err);
          return res.status(500).json(err);
        });  
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    };
  };

  const getProjectAndSlidesByPresentation = async (req, res, next) => {
    try {
      // Should be able to do a JOIN, but doing this on the plane so
      // can't stackoverflow it
      const presentation = await model.Presentation.findOne({
        where: {
          presentationGuid: req.params.presentationGuid,
        }
      });

      const project = await model.Project.findOne({
        where: {
          id: presentation.projectId,
        },
        include: { model: model.Slide }
      });

      let retObj = {
        success: true,
        project: project,
        presentation: presentation
      }

      return res.status(200).send(retObj);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  const updateProject = async (req, res, next) => {
    const { projectName, ownerName, ownerEmail } = req.body;
    // table.create(
    //   {
    //     project_name: projectName,
    //     Name: ownerName,
    //     Email: ownerEmail
    //   },
    //   (err, record) => {
    //     if (err) {
    //       console.log(err);
    //       return;
    //     }
    //     req.body.id= record.getId();
    //   }
    // )
    try {
      const project = await model.Project.findOne({ where: { id: parseInt(req.params.projectId) }});

      if (project) {
        await project.update(req.body);
        return res.status(200).send(project);
      } else {
        return res.status(500).send("Cannot find project");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  return {
    projectUpload,
    getProjectAndSlidesByPresentation,
    updateProject
  };
};

module.exports = ProjectController;