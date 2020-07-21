'use strict';

const model = require('../models');

const SlideController = () => {
  const updateNotes = async (req, res, next) => {
    try {
      const slide = await model.Slide.findOne({ where: { id: parseInt(req.body.slideId) }});

      if (slide) {
        await project.update(req.body);
        return res.status(200).send(project);
      } else {
        return res.status(500).send("Cannot find project");
      }

    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    };
  };

  return {
    updateNotes
  };
};

module.exports = SlideController;