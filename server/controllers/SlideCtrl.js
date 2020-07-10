'use strict';

const model = require('../models');
const env = process.env.NODE_ENV;

const SlideController = () => {
  const updateNotes = async (req, res, next) => {
    const slide = await model.Slide.findOne({ where: { id: parseInt(req.body.slideId) }});

    if (slide) {
      await project.update(req.body);
      return res.status(200).send(project);
    } else {
      return res.status(500).send("Cannot find project");
    }
  };

  return {
    updateNotes
  };
};

module.exports = SlideController;