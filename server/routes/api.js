'use strict';

const projectCtrl = require('../controllers/ProjectCtrl');

module.exports = (router) => {
  // Project Controller Routes
  router.route('/project/upload')
    .post(projectCtrl().projectUpload);

  router.route('/project/slides/:projectGuid')
    .get(projectCtrl().getProjectAndSlides);

  router.route('/project/update/:projectId')
    .put(projectCtrl().updateProject);

  // Slide Controller Routes

  return router;
};