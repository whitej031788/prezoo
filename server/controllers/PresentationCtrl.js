'use strict';

const model = require('../models');

const PresentationController = () => {

  const createPresentation = async (req, res, next) => {
    const presentation = await model.Presentation.create({
      projectId: project.id,
      collabCode: generateCollabCode(10)
    });
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

  const updatePresentation = async (req, res, next) => {
    try {
      const presentation = await model.Presentation.findOne({ where: { id: parseInt(req.params.presentationId) }});
      if (presentation) {
        await presentation.update(req.body);
        return res.status(200).send(presentation);
      } else {
        return res.status(500).send("Cannot find presentation");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  return {
    createPresentation,
    generateCollabCode,
    updatePresentation
  };
};

module.exports = PresentationController;