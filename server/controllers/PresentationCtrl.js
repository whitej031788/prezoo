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

  return {
    createPresentation,
    generateCollabCode
  };
};

module.exports = PresentationController;