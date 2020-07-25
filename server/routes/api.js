'use strict';

const projectCtrl = require('../controllers/ProjectCtrl');
const slideCtrl = require('../controllers/SlideCtrl');
const presentationCtrl = require('../controllers/PresentationCtrl');

module.exports = (router) => {
  // Project Controller Routes
  router.route('/project/upload')
    .post(projectCtrl().projectUpload);

  router.route('/project/slides/:presentationGuid')
    .get(projectCtrl().getProjectAndSlidesByPresentation);

  router.route('/project/update/:projectId')
    .put(projectCtrl().updateProject);

  router.route('/presentation/update/:presentationId')
    .put(presentationCtrl().updatePresentation);

  // Slide Controller Routes
  router.route('/slide/notes')
    .post(slideCtrl().updateNotes);

  return router;
};